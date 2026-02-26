<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AdminClientController extends AbstractController
{
    #[Route('/adminClient', name: 'app_admin_client')]
    public function index(): Response
    {
        return $this->render('admin_client/index.html.twig', [
            'controller_name' => 'AdminClientController',
        ]);
    }
}
