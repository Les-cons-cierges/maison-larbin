<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260227132604 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Ignorée si la table entreprise n'existe pas encore (elle sera créée par Version20260302134039)
        $tableExists = $this->connection->createSchemaManager()->tablesExist(['entreprise']);
        if (!$tableExists) {
            return;
        }

        $this->addSql('ALTER TABLE entreprise CHANGE type_abonnement type_abonnement VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise CHANGE type_abonnement type_abonnement VARCHAR(255) NOT NULL');
    }
}
