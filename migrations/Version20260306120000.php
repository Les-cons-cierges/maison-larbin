<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260306120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Pre-remplit la table categorie avec les categories par defaut.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            INSERT INTO categorie (nom, description, created_at, updated_at)
            SELECT 'Team building', 'Activites de cohesion d''equipe', NOW(), NULL
            WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE nom = 'Team building')
        SQL);

        $this->addSql(<<<'SQL'
            INSERT INTO categorie (nom, description, created_at, updated_at)
            SELECT 'Lavage vehicules de service', 'Nettoyage et entretien des vehicules', NOW(), NULL
            WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE nom = 'Lavage vehicules de service')
        SQL);

        $this->addSql(<<<'SQL'
            INSERT INTO categorie (nom, description, created_at, updated_at)
            SELECT 'Restaurant', 'Reservation de restaurant pour equipes', NOW(), NULL
            WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE nom = 'Restaurant')
        SQL);

        $this->addSql(<<<'SQL'
            INSERT INTO categorie (nom, description, created_at, updated_at)
            SELECT 'Coworking', 'Reservation d''espace de coworking', NOW(), NULL
            WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE nom = 'Coworking')
        SQL);

        $this->addSql(<<<'SQL'
            INSERT INTO categorie (nom, description, created_at, updated_at)
            SELECT 'Salle de reunion', 'Reservation de salle de reunion', NOW(), NULL
            WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE nom = 'Salle de reunion')
        SQL);
    }

    public function down(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            DELETE FROM categorie
            WHERE nom IN (
                'Team building',
                'Lavage vehicules de service',
                'Restaurant',
                'Coworking',
                'Salle de reunion'
            )
        SQL);
    }
}
