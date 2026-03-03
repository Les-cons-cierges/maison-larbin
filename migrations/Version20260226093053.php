<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260226093053 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE requete ADD auteur_id INT NOT NULL, ADD entreprise_id INT NOT NULL, ADD categorie_id INT NOT NULL, ADD assignee_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA60BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AAA4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AABCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE requete ADD CONSTRAINT FK_1E6639AA59EC7D60 FOREIGN KEY (assignee_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_1E6639AA60BB6FE6 ON requete (auteur_id)');
        $this->addSql('CREATE INDEX IDX_1E6639AAA4AEAFEA ON requete (entreprise_id)');
        $this->addSql('CREATE INDEX IDX_1E6639AABCF5E72D ON requete (categorie_id)');
        $this->addSql('CREATE INDEX IDX_1E6639AA59EC7D60 ON requete (assignee_id)');
        $this->addSql('ALTER TABLE user ADD entreprise_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('CREATE INDEX IDX_8D93D649A4AEAFEA ON user (entreprise_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA60BB6FE6');
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AAA4AEAFEA');
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AABCF5E72D');
        $this->addSql('ALTER TABLE requete DROP FOREIGN KEY FK_1E6639AA59EC7D60');
        $this->addSql('DROP INDEX IDX_1E6639AA60BB6FE6 ON requete');
        $this->addSql('DROP INDEX IDX_1E6639AAA4AEAFEA ON requete');
        $this->addSql('DROP INDEX IDX_1E6639AABCF5E72D ON requete');
        $this->addSql('DROP INDEX IDX_1E6639AA59EC7D60 ON requete');
        $this->addSql('ALTER TABLE requete DROP auteur_id, DROP entreprise_id, DROP categorie_id, DROP assignee_id');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649A4AEAFEA');
        $this->addSql('DROP INDEX IDX_8D93D649A4AEAFEA ON user');
        $this->addSql('ALTER TABLE user DROP entreprise_id');
    }
}
