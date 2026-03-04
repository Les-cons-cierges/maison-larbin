<?php

namespace App\Controller\AdminMaisonLarbin;

use App\Controller\Admin\EntrepriseCrudController;
use App\Entity\User;
use App\Repository\EntrepriseRepository;
use App\Repository\UserRepository;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;



#[AdminDashboard(routePath: '/maison-larbin/admin', routeName: 'admin_maison_larbin')]
class DashboardMaisonLarbinController extends AbstractDashboardController
{
    public function __construct(
        private readonly EntrepriseRepository $entrepriseRepository,
        private readonly UserRepository $userRepository
    ) {
    }

    public function index(): Response
    {
        $totalClients = $this->entrepriseRepository->count([]);
        $totalEmployesMaisonLarbin = $this->countUsersWithRole(
            $this->userRepository->findAll(),
            'ROLE_MAISON_LARBIN'
        );
        $offresStats = $this->entrepriseRepository->getOfferBreakdown();

        return $this->render('AdminMaisonLarbin/dashboard.html.twig', [
            'totalClients' => $totalClients,
            'totalEmployesMaisonLarbin' => $totalEmployesMaisonLarbin,
            'offresStats' => $offresStats,
        ]);

        // Option 1. You can make your dashboard redirect to some common page of your backend
        //
        // return $this->redirectToRoute('admin_user_index');

        // Option 2. You can make your dashboard redirect to different pages depending on the user
        //
        // if ('jane' === $this->getUser()->getUsername()) {
        //     return $this->redirectToRoute('...');
        // }

        // Option 3. You can render some custom template to display a proper dashboard with widgets, etc.
        // (tip: it's easier if your template extends from @EasyAdmin/page/content.html.twig)
        //
        // return $this->render('some/path/my-dashboard.html.twig');
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
        yield MenuItem::linkTo(UserCrudController::class, 'Employes', 'fa fa-users')
            ->setAction('index');
        yield MenuItem::linkTo(EntrepriseCrudController::class, 'Entreprises clientes', 'fa fa-building')
            ->setAction('index');
        yield MenuItem::linkTo(RequeteCrudController::class, 'Requetes', 'fa fa-inbox')
            ->setAction('index');
    }

    /**
     * @param User[] $users
     */
    private function countUsersWithRole(array $users, string $role): int
    {
        $count = 0;

        foreach ($users as $user) {
            if (\in_array($role, $user->getRoles(), true)) {
                ++$count;
            }
        }

        return $count;
    }
}
