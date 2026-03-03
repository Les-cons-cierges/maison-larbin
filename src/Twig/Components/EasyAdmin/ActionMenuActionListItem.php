<?php

namespace App\Twig\Components\EasyAdmin;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(
    name: 'ea:ActionMenu:ActionList:Item',
    template: '@ea/components/ActionMenu/ActionList/Item.html.twig'
)]
final class ActionMenuActionListItem
{
}

