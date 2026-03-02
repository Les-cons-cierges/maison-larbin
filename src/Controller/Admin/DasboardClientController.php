<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Controller\Admin\UserCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/adminClient', routeName: 'adminClient')]
class DasboardClientController extends AbstractDashboardController
{
    public function index(): Response
    {
        return $this->render('admin_client/dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Maison Larbin');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkTo(UserCrudController::class, 'User', 'fas fa-users');
        // ->setController(UserCrudController::class);
        // yield MenuItem::linkToRoute('Entreprise', 'fas fa-building', 'company_index');
        // yield MenuItem::linkToRoute('Abonnement', 'fas fa-credit-card', 'subscription_index');
    }
}
