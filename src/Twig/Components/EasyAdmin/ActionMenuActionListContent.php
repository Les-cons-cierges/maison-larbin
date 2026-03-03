<?php

namespace App\Twig\Components\EasyAdmin;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(
    name: 'ea:ActionMenu:ActionList:Content',
    template: '@ea/components/ActionMenu/ActionList/Content.html.twig'
)]
final class ActionMenuActionListContent
{
}

