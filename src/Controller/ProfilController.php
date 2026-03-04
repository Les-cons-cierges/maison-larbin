<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ProfilType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class ProfilController extends AbstractController
{
    #[Route('/profil', name: 'app_profil', methods: ['GET', 'POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): Response {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur non authentifié.');
        }

        $form = $this->createForm(ProfilType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = (string) $form->get('plainPassword')->getData();
            if (trim($plainPassword) !== '') {
                $user->setPassword($passwordHasher->hashPassword($user, $plainPassword));
            }

            $avatarFile = $form->get('avatarFile')->getData();
            if ($avatarFile !== null) {
                $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/avatars';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0775, true);
                }

                $extension = $avatarFile->guessExtension() ?: $avatarFile->getClientOriginalExtension() ?: 'bin';
                $newFilename = uniqid('avatar_', true) . '.' . $extension;

                try {
                    $avatarFile->move($uploadDir, $newFilename);
                    $user->setAvatar($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Erreur lors de l’upload de l’avatar.');
                    return $this->redirectToRoute('app_profil');
                }
            }

            if (method_exists($user, 'setUpdatedAt')) {
                $user->setUpdatedAt(new \DateTimeImmutable());
            }

            $entityManager->flush();

            $this->addFlash('success', 'Profil mis à jour avec succès.');
            return $this->redirectToRoute('app_profil');
        }

        $entrepriseName = 'Non assignée';
        $entreprise = method_exists($user, 'getEntreprise') ? $user->getIdEntreprise() : (method_exists($user, 'getIdEntreprise') ? $user->getIdEntreprise() : null);
        if ($entreprise !== null && method_exists($entreprise, 'getNom')) {
            $entrepriseName = (string) $entreprise->getNom();
        }

        return $this->render('profil/index.html.twig', [
            'profilForm' => $form->createView(),
            'user' => $user,
            'entrepriseName' => $entrepriseName,
        ]);
    }
}
