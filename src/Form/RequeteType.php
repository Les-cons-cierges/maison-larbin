<?php

namespace App\Form;

use App\Entity\Categorie;
use App\Entity\Requete;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RequeteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre', TextType::class, [
                'label' => 'Titre de la requête',
            ])
            ->add('categorie', EntityType::class, [
                'class' => Categorie::class,
                'choice_label' => 'nom',
                'placeholder' => 'Choisir une catégorie',
                'label' => 'Catégorie de service',
            ])
            ->add('dateSouhaitee', DateType::class, [
                'label' => 'Date souhaitée',
                'widget' => 'single_text',
                'required' => false,
                'input' => 'datetime_immutable',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Détails',
                'required' => false,
                'attr' => ['rows' => 6],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Requete::class,
        ]);
    }
}
