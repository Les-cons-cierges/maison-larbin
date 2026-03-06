<?php

namespace App\DataFixtures;

use App\Entity\Categorie as CategorieEntity;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class Categorie extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $categories = [
            [
                'nom' => 'Team building',
                'description' => 'Activités de cohésion d\'équipe',
            ],
            [
                'nom' => 'Lavage véhicules de service',
                'description' => 'Nettoyage et entretien des véhicules',
            ],
            [
                'nom' => 'Restaurant',
                'description' => 'Réservation de restaurant pour équipes',
            ],
            [
                'nom' => 'Coworking',
                'description' => 'Réservation d\'espace de coworking',
            ],
            [
                'nom' => 'Salle de réunion',
                'description' => 'Réservation de salle de réunion',
            ],
        ];

        foreach ($categories as $data) {
            $categorie = new CategorieEntity();
            $categorie->setNom($data['nom']);
            $categorie->setDescription($data['description']);
            $categorie->setCreatedAt(new \DateTimeImmutable());
            $categorie->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($categorie);
        }

        $manager->flush();
    }
}