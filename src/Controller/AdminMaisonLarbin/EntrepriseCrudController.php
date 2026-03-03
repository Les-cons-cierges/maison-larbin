<?php

namespace App\Controller\AdminMaisonLarbin;

use App\Entity\Entreprise;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;

class EntrepriseCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Entreprise::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('nom', 'Entreprise'),
            TextField::new('siret', 'SIRET'),
            TextField::new('ville', 'Ville'),
            TextField::new('type_abonnement', 'Abonnement'),
            AssociationField::new('owner', 'Client propriétaire')
                ->formatValue(static function ($value, Entreprise $entreprise): string {
                    $owner = $entreprise->getOwner();
                    if (!$owner instanceof User) {
                        return 'Non attribué';
                    }

                    return sprintf(
                        '%s %s (%s)',
                        $owner->getPrenom() ?? '',
                        $owner->getNom() ?? '',
                        $owner->getEmail() ?? ''
                    );
                }),
            DateTimeField::new('created_at', 'Créée le')->hideOnForm(),
            DateTimeField::new('updated_at', 'Mise à jour')->hideOnForm(),
        ];
    }
}
