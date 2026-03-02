<?php

use EasyCorp\Bundle\EasyAdminBundle\EasyAdminBundle;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function (RoutingConfigurator $routes): void {
    if (!class_exists(EasyAdminBundle::class)) {
        return;
    }

    $routes->import('.', 'easyadmin.routes');
};
