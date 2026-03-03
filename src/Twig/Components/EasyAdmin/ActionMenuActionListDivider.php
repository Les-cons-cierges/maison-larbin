<?php

namespace App\Twig\Components\EasyAdmin;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(
    name: 'ea:ActionMenu:ActionList:Divider',
    template: '@ea/components/ActionMenu/ActionList/Divider.html.twig'
)]
final class ActionMenuActionListDivider
{
}

