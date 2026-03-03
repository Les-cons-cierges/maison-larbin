<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260303130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Allow user deletion by relaxing user foreign keys (SET NULL/CASCADE).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE entreprise DROP FOREIGN KEY FK_D19FA607E3C61F9');
        $this->addSql('ALTER TABLE entreprise ADD CONSTRAINT FK_D19FA607E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA60BB6FE6');
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA59EC7D60');
        $this->addSql('ALTER TABLE requete CHANGE auteur_id auteur_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA60BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA59EC7D60 FOREIGN KEY (assignee_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql('ALTER TABLE reset_password_request DROP FOREIGN KEY FK_7CE748AA76ED395');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT FK_7CE748AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE reset_password_request DROP FOREIGN KEY FK_7CE748AA76ED395');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT FK_7CE748AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');

        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA60BB6FE6');
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA59EC7D60');
        $this->addSql('ALTER TABLE requete CHANGE auteur_id auteur_id INT NOT NULL');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA60BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA59EC7D60 FOREIGN KEY (assignee_id) REFERENCES user (id)');

        $this->addSql('ALTER TABLE entreprise DROP FOREIGN KEY FK_D19FA607E3C61F9');
        $this->addSql('ALTER TABLE entreprise ADD CONSTRAINT FK_D19FA607E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
    }
}
