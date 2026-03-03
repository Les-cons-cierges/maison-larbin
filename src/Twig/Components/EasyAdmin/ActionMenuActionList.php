<?php

namespace App\Twig\Components\EasyAdmin;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(
    name: 'ea:ActionMenu:ActionList',
    template: '@ea/components/ActionMenu/ActionList.html.twig'
)]
final class ActionMenuActionList
{
}

