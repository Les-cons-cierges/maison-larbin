<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260226124756 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $schemaManager = $this->connection->createSchemaManager();

        if (!$schemaManager->tablesExist(['user'])) {
            return;
        }

        $userTable = $schemaManager->introspectTable('user');

        if ($userTable->hasColumn('role') && !$userTable->hasColumn('roles')) {
            $this->addSql('ALTER TABLE user ADD roles JSON NOT NULL, DROP role');
        }

        if ($userTable->hasColumn('email') && !$userTable->hasIndex('UNIQ_8D93D649E7927C74')) {
            $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
        }
    }

    public function down(Schema $schema): void
    {
        $schemaManager = $this->connection->createSchemaManager();

        $this->skipIf(
            !$schemaManager->tablesExist(['user']),
            'Legacy migration down skipped: table "user" does not exist.'
        );

        $userTable = $schemaManager->introspectTable('user');

        if ($userTable->hasIndex('UNIQ_8D93D649E7927C74')) {
            $this->addSql('DROP INDEX UNIQ_8D93D649E7927C74 ON user');
        }

        if ($userTable->hasColumn('roles') && !$userTable->hasColumn('role')) {
            $this->addSql('ALTER TABLE user ADD role VARCHAR(255) NOT NULL, DROP roles');
        }
    }
}
