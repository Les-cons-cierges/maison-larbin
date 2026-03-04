<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

final class ProfilController extends AbstractController
{
    #[Route('/profil', name: 'app_profil')]
    public function index(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        SluggerInterface $slugger,
    ): Response {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur non connecté.');
        }

        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = (string) $form->get('plainPassword')->getData();
            if ($plainPassword !== '') {
                $user->setPassword($passwordHasher->hashPassword($user, $plainPassword));
            }

            $avatarFile = $form->get('avatarFile')->getData();
            if ($avatarFile) {
                $originalFilename = pathinfo($avatarFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $avatarFile->guessExtension();

                try {
                    $avatarFile->move($this->getParameter('avatar_directory'), $newFilename);
                    $user->setAvatar($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Upload avatar impossible.');
                    return $this->redirectToRoute('app_profil');
                }
            }

            $user->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush(); // pas de persist() ici: user déjà managé

            $this->addFlash('success', 'Profil mis à jour avec succès.');
            return $this->redirectToRoute('app_profil');
        }

        return $this->render('profil/index.html.twig', [
            'profilForm' => $form->createView(),
            'currentAvatar' => $user->getAvatar(),
        ]);
    }
}
