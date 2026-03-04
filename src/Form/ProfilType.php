<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\Length;

class ProfilType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom', TextType::class, [
                'label' => 'Nom',
            ])
            ->add('prenom', TextType::class, [
                'label' => 'Prénom',
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email',
            ])
            ->add('plainPassword', PasswordType::class, [
                'label' => 'Nouveau mot de passe (optionnel)',
                'mapped' => false,
                'required' => false,
                'empty_data' => '',
                'attr' => ['autocomplete' => 'new-password'],
                'constraints' => [
                    new Length(
                        min: 8,
                        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.'
                    ),
                ],
            ])
            ->add('avatarFile', FileType::class, [
                'label' => 'Avatar (optionnel)',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new Image(
                        maxSize: '4M',
                        mimeTypes: [
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                            'image/gif',
                            'image/svg+xml',
                        ],
                        mimeTypesMessage: 'Veuillez envoyer une image valide.',
                    ),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}