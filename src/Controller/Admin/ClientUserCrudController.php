<?php

namespace App\Controller\Admin;

use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Count;


class ClientUserCrudController extends AbstractCrudController
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {}

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('nom')
                ->setRequired(true)
                ->setFormTypeOption('constraints', [
                    new NotBlank(message: 'Le nom est obligatoire.'),
                ]),

            TextField::new('prenom')
                ->setRequired(true)
                ->setFormTypeOption('constraints', [
                    new NotBlank(message: 'Le prenom est obligatoire.'),
                ]),

            EmailField::new('email')
                ->setRequired(true)
                ->setFormTypeOption('constraints', [
                    new NotBlank(message: 'L\'email est obligatoire.'),
                ]),

            TextField::new('password', 'Mot de passe')
                ->onlyWhenCreating()
                ->setFormType(PasswordType::class)
                ->setRequired(true),

            ChoiceField::new('roles', 'Role')
                ->setChoices([
                    'Employé' => 'ROLE_EMPLOYE',
                    'Cadre' => 'ROLE_CADRE',
                    'Direction' => 'ROLE_DIRECTION',
                    'Admin' => 'ROLE_ADMIN',
                ])
                ->allowMultipleChoices()
                ->setRequired(true)
                ->setFormTypeOption('constraints', [
                    new Count(min: 1, minMessage: 'Selectionnez un role.'),
                ]),
            DateTimeField::new('created_at', 'Crée le')->hideOnForm(),
            DateTimeField::new('updated_at', 'Mis a jour le')->hideOnForm(),

        ];
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
            $qb->andWhere('1 = 0');

            return $qb;
        }

        return $qb
            ->andWhere('entity.idEntreprise = :entreprise')
            ->setParameter('entreprise', $currentUser->getIdEntreprise());
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (!$entityInstance instanceof User) {
            parent::persistEntity($entityManager, $entityInstance);
            return;
        }

        $currentUser = $this->getUser();
        if (!$currentUser instanceof User || null === $currentUser->getIdEntreprise()) {
            throw new AccessDeniedException('Aucune entreprise associee au compte connecte.');
        }

        // recup id entreprise
        $entityInstance->setIdEntreprise($currentUser->getIdEntreprise());

        // Hash du mot de passe saisi dans le form
        if ($entityInstance->getPassword()) {
            $entityInstance->setPassword(
                $this->passwordHasher->hashPassword($entityInstance, $entityInstance->getPassword())
            );
        }


        $now = new DateTimeImmutable();
        $entityInstance->setCreatedAt($now);
        $entityInstance->setUpdatedAt($now);

        $this->normalizeSingleRole($entityInstance);

        parent::persistEntity($entityManager, $entityInstance);
    }
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (!$entityInstance instanceof User) {
            parent::updateEntity($entityManager, $entityInstance);
            return;
        }

        $this->normalizeSingleRole($entityInstance);
        $entityInstance->setUpdatedAt(new \DateTimeImmutable());

        parent::updateEntity($entityManager, $entityInstance);
    }

    private function normalizeSingleRole(User $user): void
    {
        $roles = array_values(array_filter(
            $user->getRoles(),
            static fn(string $r) => $r !== 'ROLE_USER'
        ));

        $user->setRoles(isset($roles[0]) ? [$roles[0]] : []);
    }
}
