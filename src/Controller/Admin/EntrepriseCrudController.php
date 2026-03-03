<?php

namespace App\Controller\Admin;

use App\Entity\Entreprise;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class EntrepriseCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Entreprise::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('nom', 'Nom'),
            TextField::new('siret', 'SIRET'),
            TextField::new('adresse', 'Adresse'),
            TextField::new('code_postal', 'Code postal'),
            TextField::new('ville', 'Ville'),
            TextField::new('pays', 'Pays'),
            TextField::new('telephone', 'Telephone'),
            TextField::new('type_abonnement', 'Type abonnement')->hideOnForm(),
            DateTimeField::new('created_at', 'Crée le')->hideOnForm(),
            DateTimeField::new('updated_at', 'Mis a jour le')->hideOnForm(),
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions->disable(Action::NEW, Action::DELETE, Action::DETAIL);
    }

    public function createIndexQueryBuilder(
        SearchDto $searchDto,
        EntityDto $entityDto,
        FieldCollection $fields,
        FilterCollection $filters
    ): QueryBuilder {
        $qb = parent::createIndexQueryBuilder($searchDto, $entityDto, $fields, $filters);

        $currentUser = $this->getUser();
        if (!$currentUser instanceof User || null === $currentUser->getIdEntreprise()) {
            return $qb->andWhere('1 = 0');
        }

        return $qb
            ->andWhere('entity.id = :entrepriseId')
            ->setParameter('entrepriseId', $currentUser->getIdEntreprise()->getId());
    }

    public function edit(AdminContext $context): KeyValueStore|Response
    {
        $this->denyAccessUnlessCurrentUserOwnsEntity($context->getEntity()->getInstance());

        return parent::edit($context);
    }

    public function updateEntity(EntityManagerInterface $entityManager, object $entityInstance): void
    {
        $this->denyAccessUnlessCurrentUserOwnsEntity($entityInstance);

        parent::updateEntity($entityManager, $entityInstance);
    }

    private function denyAccessUnlessCurrentUserOwnsEntity(object $entityInstance): void
    {
        if (!$entityInstance instanceof Entreprise) {
            throw new AccessDeniedException('Type d entite invalide.');
        }

        $currentUser = $this->getUser();
        if (!$currentUser instanceof User || null === $currentUser->getIdEntreprise()) {
            throw new AccessDeniedException('Aucune entreprise associee au compte connecte.');
        }

        if ($entityInstance->getId() !== $currentUser->getIdEntreprise()->getId()) {
            throw new AccessDeniedException('Acces refuse a cette entreprise.');
        }
    }
}
