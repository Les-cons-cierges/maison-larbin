<?php

namespace App\Controller;

use App\Entity\Requete;
use App\Entity\User;
use App\Form\RequeteType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/requete')]
final class RequeteController extends AbstractController
{
    #[Route('/nouvelle', name: 'app_requete_new', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_CADRE')]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user instanceof User || null === $user->getIdEntreprise()) {
            $this->addFlash('error', 'Aucune entreprise associée à votre compte.');
            return $this->redirectToRoute('app_home');
        }

        $requete = new Requete();
        $form = $this->createForm(RequeteType::class, $requete);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $now = new \DateTimeImmutable();

            $requete->setAuteur($user);
            $requete->setEntreprise($user->getIdEntreprise());
            $requete->setStatut('A_TRAITER');
            $requete->setCreatedAt($now);
            $requete->setUpdatedAt($now);

            $em->persist($requete);
            $em->flush();

            $this->addFlash('success', 'Votre requête a bien été envoyée.');
            return $this->redirectToRoute('app_requete_new');
        }

        return $this->render('requete/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
