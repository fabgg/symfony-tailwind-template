<?php

namespace App\Controller;

use App\Form\DemoType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/styleguide')]
class StyleguideController extends AbstractController
{
    #[Route('/typography', name: 'app_styleguide_typography')]
    public function typography(): Response
    {
        return $this->render('pages/styleguide/typography.html.twig');
    }

    #[Route('/components', name: 'app_styleguide_components')]
    public function components(): Response
    {
        return $this->render('pages/styleguide/components.html.twig');
    }

    #[Route('/forms', name: 'app_styleguide_forms')]
    public function forms(Request $request): Response
    {
        $form = $this->createForm(DemoType::class);
        $form->handleRequest($request);

        return $this->render('pages/styleguide/forms.html.twig', [
            'form' => $form,
        ]);
    }
}
