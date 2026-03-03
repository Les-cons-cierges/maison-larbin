<?php

namespace App\Twig\Components\EasyAdmin;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(
    name: 'ea:ActionMenu:ActionList:Header',
    template: '@ea/components/ActionMenu/ActionList/Header.html.twig'
)]
final class ActionMenuActionListHeader
{
}

