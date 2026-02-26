<?php

namespace App\Controller;

use App\Entity\Entreprise;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EntrepriseRegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_entreprise_register')]
    public function register(Request $request, EntityManagerInterface $entityManager): Response
    {
        $values = [
            'nom' => '',
            'siret' => '',
            'adresse' => '',
            'code_postal' => '',
            'ville' => '',
            'pays' => '',
            'telephone' => '',
            'type_abonnement' => '',
        ];
        $errors = [];
        $abonnementChoices = [
            'abonnement_1',
            'abonnement_2',
            'abonnement_3',
        ];

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

            if ($values['type_abonnement'] !== '' && !in_array($values['type_abonnement'], $abonnementChoices, true)) {
                $errors['type_abonnement'] = 'Type d’abonnement invalide.';
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
                $entreprise->setTypeAbonnement($values['type_abonnement']);
                $now = new \DateTimeImmutable();
                $entreprise->setCreatedAt($now);
                $entreprise->setUpdatedAt($now);

                $entityManager->persist($entreprise);
                $entityManager->flush();

                $this->addFlash('success', 'Entreprise inscrite avec succès.');

                return $this->redirectToRoute('app_home');
            }
        }

        return $this->render('entreprise_registration/register.html.twig', [
            'values' => $values,
            'errors' => $errors,
            'abonnementChoices' => $abonnementChoices,
        ]);
    }
}
