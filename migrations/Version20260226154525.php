<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260226154525 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE entreprise ADD CONSTRAINT FK_D19FA607E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_D19FA607E3C61F9 ON entreprise (owner_id)');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY `FK_8D93D649A4AEAFEA`');
        $this->addSql('DROP INDEX IDX_8D93D649A4AEAFEA ON user');
        $this->addSql('ALTER TABLE user DROP entreprise_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise DROP FOREIGN KEY FK_D19FA607E3C61F9');
        $this->addSql('DROP INDEX IDX_D19FA607E3C61F9 ON entreprise');
        $this->addSql('ALTER TABLE entreprise DROP owner_id');
        $this->addSql('ALTER TABLE user ADD entreprise_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT `FK_8D93D649A4AEAFEA` FOREIGN KEY (entreprise_id) REFERENCES entreprise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8D93D649A4AEAFEA ON user (entreprise_id)');
    }
}
