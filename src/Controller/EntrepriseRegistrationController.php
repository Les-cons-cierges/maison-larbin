<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EntrepriseRegistrationController extends AbstractController
{
    private const ABONNEMENT_CHOICES = [
        'abonnement_1',
        'abonnement_2',
        'abonnement_3',
    ];

    #[Route('/entreprise/register', name: 'app_entreprise_register')]
    public function register(Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $values = [
            'nom' => '',
            'siret' => '',
            'adresse' => '',
            'code_postal' => '',
            'ville' => '',
            'pays' => '',
            'telephone' => '',
        ];
        $errors = [];

        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('register_entreprise', (string) $request->request->get('_token'))) {
                $errors[] = 'Le formulaire a expiré. Merci de réessayer.';
            }

            foreach (array_keys($values) as $field) {
                $values[$field] = trim((string) $request->request->get($field, ''));
                if ($values[$field] === '') {
                    $errors[$field] = 'Ce champ est obligatoire.';
                }
            }

            if ($values['siret'] !== '' && !preg_match('/^\d{14}$/', preg_replace('/\s+/', '', $values['siret']))) {
                $errors['siret'] = 'Le SIRET doit contenir 14 chiffres.';
            }

            $existingEntreprise = null;
            if ($values['siret'] !== '') {
                $existingEntreprise = $entityManager
                    ->getRepository(Entreprise::class)
                    ->findOneBy(['siret' => preg_replace('/\s+/', '', $values['siret'])]);
            }

            if ($existingEntreprise instanceof Entreprise) {
                $errors['siret'] = 'Une entreprise avec ce SIRET existe déjà.';
            }

            if ($errors === []) {
                $entreprise = new Entreprise();
                $entreprise->setNom($values['nom']);
                $entreprise->setSiret(preg_replace('/\s+/', '', $values['siret']));
                $entreprise->setAdresse($values['adresse']);
                $entreprise->setCodePostal($values['code_postal']);
                $entreprise->setVille($values['ville']);
                $entreprise->setPays($values['pays']);
                $entreprise->setTelephone($values['telephone']);
                $entreprise->setTypeAbonnement(null);
                $currentUser = $this->getUser();
                if ($currentUser instanceof User) {
                    $entreprise->setOwner($currentUser);
                }
                $now = new \DateTimeImmutable();
                $entreprise->setCreatedAt($now);
                $entreprise->setUpdatedAt($now);

                $entityManager->persist($entreprise);
                $entityManager->flush();

                $this->addFlash('success', 'Entreprise inscrite avec succès.');

                return $this->redirectToRoute('app_entreprise_offer', [
                    'id' => $entreprise->getId(),
                ]);
            }
        }

        return $this->render('entreprise_registration/register.html.twig', [
            'values' => $values,
            'errors' => $errors,
        ]);
    }

    #[Route('/entreprise/{id}/offre', name: 'app_entreprise_offer', methods: ['GET', 'POST'])]
    public function offerChoice(Entreprise $entreprise, Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $currentUser = $this->getUser();
        if (!$currentUser instanceof User || $entreprise->getOwner()?->getId() !== $currentUser->getId()) {
            throw $this->createAccessDeniedException('Vous ne pouvez pas modifier cette entreprise.');
        }

        $selected = $entreprise->getTypeAbonnement() ?? '';
        $error = null;

        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('choose_offer_'.$entreprise->getId(), (string) $request->request->get('_token'))) {
                $error = 'Le formulaire a expiré. Merci de réessayer.';
            } else {
                $selected = trim((string) $request->request->get('type_abonnement', ''));
                if (!in_array($selected, self::ABONNEMENT_CHOICES, true)) {
                    $error = 'Type d’abonnement invalide.';
                }
            }

            if ($error === null) {
                $entreprise->setTypeAbonnement($selected);
                $entreprise->setUpdatedAt(new \DateTimeImmutable());
                $entityManager->flush();

                $this->addFlash('success', 'Offre enregistrée avec succès.');

                return $this->redirectToRoute('app_home');
            }
        }

        return $this->render('entreprise_registration/choix_offre.html.twig', [
            'entreprise' => $entreprise,
            'abonnementChoices' => self::ABONNEMENT_CHOICES,
            'selected' => $selected,
            'error' => $error,
        ]);
    }
}
