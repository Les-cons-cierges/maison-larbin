<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260302140333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $schemaManager = $this->connection->createSchemaManager();

        $this->skipIf(
            !$schemaManager->tablesExist(['user', 'entreprise']),
            'Migration skipped: expected tables are missing.'
        );

        $userTable = $schemaManager->introspectTable('user');

        if (!$userTable->hasColumn('id_entreprise_id')) {
            $this->addSql('ALTER TABLE user ADD id_entreprise_id INT DEFAULT NULL');
        }

        if (!$userTable->hasForeignKey('FK_8D93D6491A867E8F')) {
            $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6491A867E8F FOREIGN KEY (id_entreprise_id) REFERENCES entreprise (id)');
        }

        if (!$userTable->hasIndex('IDX_8D93D6491A867E8F')) {
            $this->addSql('CREATE INDEX IDX_8D93D6491A867E8F ON user (id_entreprise_id)');
        }
    }

    public function down(Schema $schema): void
    {
        $schemaManager = $this->connection->createSchemaManager();

        $this->skipIf(
            !$schemaManager->tablesExist(['user']),
            'Migration down skipped: table "user" is missing.'
        );

        $userTable = $schemaManager->introspectTable('user');

        if ($userTable->hasForeignKey('FK_8D93D6491A867E8F')) {
            $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6491A867E8F');
        }

        if ($userTable->hasIndex('IDX_8D93D6491A867E8F')) {
            $this->addSql('DROP INDEX IDX_8D93D6491A867E8F ON user');
        }

        if ($userTable->hasColumn('id_entreprise_id')) {
            $this->addSql('ALTER TABLE user DROP id_entreprise_id');
        }
    }
}
