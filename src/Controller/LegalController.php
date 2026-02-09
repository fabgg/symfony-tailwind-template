<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LegalController extends AbstractController
{
    #[Route('/mentions-legales', name: 'app_legal_mentions')]
    public function index(): Response
    {
        return $this->render('pages/legal/index.html.twig');
    }
}
