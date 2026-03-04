<?php

namespace App\Controller\AdminMaisonLarbin;

use App\Entity\Requete;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class RequeteCrudController extends AbstractCrudController
{
    public const STATUS_A_TRAITER = 'A_TRAITER';
    public const STATUS_EN_COURS = 'EN_COURS';
    public const STATUS_TRAITEE = 'TRAITEE';
    public const STATUS_ANNULEE = 'ANNULEE';

    public static function getEntityFqcn(): string
    {
        return Requete::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Requete')
            ->setEntityLabelInPlural('Requetes')
            ->setDefaultSort(['created_at' => 'DESC']);
    }

    public function configureActions(Actions $actions): Actions
    {
        $writeEmailAction = Action::new('writeEmail', 'Ecrire au client', 'fa fa-envelope')
            ->linkToUrl(static function (Requete $requete): string {
                $email = $requete->getAuteur()?->getEmail();
                if (null === $email || '' === trim($email)) {
                    return '#';
                }

                $subject = rawurlencode('Maison Larbin - Votre requete : '.$requete->getTitre());

                return sprintf('mailto:%s?subject=%s', rawurlencode($email), $subject);
            })
            ->displayIf(static function (Requete $requete): bool {
                $email = $requete->getAuteur()?->getEmail();

                return null !== $email && '' !== trim($email);
            });

        return $actions
            ->add(Crud::PAGE_INDEX, $writeEmailAction)
            ->add(Crud::PAGE_DETAIL, $writeEmailAction);
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('titre', 'Titre'),
            AssociationField::new('categorie', 'Categorie')
                ->setRequired(true),
            AssociationField::new('entreprise', 'Entreprise')
                ->setRequired(true),
            AssociationField::new('auteur', 'Auteur')
                ->setRequired(false),
            AssociationField::new('assignee', 'Assigne a')
                ->setRequired(false),
            ChoiceField::new('statut', 'Statut')
                ->setChoices([
                    'A traiter' => self::STATUS_A_TRAITER,
                    'En cours' => self::STATUS_EN_COURS,
                    'Traitee' => self::STATUS_TRAITEE,
                    'Annulee' => self::STATUS_ANNULEE,
                ])
                ->renderAsBadges([
                    self::STATUS_A_TRAITER => 'warning',
                    self::STATUS_EN_COURS => 'info',
                    self::STATUS_TRAITEE => 'success',
                    self::STATUS_ANNULEE => 'secondary',
                ]),
            DateTimeField::new('date_souhaitee', 'Date souhaitee')
                ->setFormTypeOption('input', 'datetime_immutable')
                ->setRequired(false),
            TextEditorField::new('description', 'Description')
                ->hideOnIndex()
                ->setRequired(false),
            DateTimeField::new('created_at', 'Cree le')->hideOnForm(),
            DateTimeField::new('updated_at', 'Mis a jour le')->hideOnForm(),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof Requete) {
            $now = new \DateTimeImmutable();

            if (null === $entityInstance->getCreatedAt()) {
                $entityInstance->setCreatedAt($now);
            }

            if (null === $entityInstance->getStatut() || '' === trim($entityInstance->getStatut())) {
                $entityInstance->setStatut(self::STATUS_A_TRAITER);
            }

            $entityInstance->setUpdatedAt($now);
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof Requete) {
            $entityInstance->setUpdatedAt(new \DateTimeImmutable());
        }

        parent::updateEntity($entityManager, $entityInstance);
    }
}
