<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Controller\Admin\ClientUserCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
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

    public function configureAssets(): Assets
    {
        return Assets::new()->addAssetMapperEntry('admin');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkTo(ClientUserCrudController::class, 'User', 'fas fa-users');
        // ->setController(UserCrudController::class);
        // yield MenuItem::linkToRoute('Entreprise', 'fas fa-building', 'company_index');
        // yield MenuItem::linkToRoute('Abonnement', 'fas fa-credit-card', 'subscription_index');
    }
}
