<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        $stats = [
            ['label' => 'Users', 'value' => '1,234', 'change' => '+12%', 'trend' => 'up'],
            ['label' => 'Revenue', 'value' => '$45,678', 'change' => '+8%', 'trend' => 'up'],
            ['label' => 'Orders', 'value' => '892', 'change' => '-3%', 'trend' => 'down'],
            ['label' => 'Conversion rate', 'value' => '3.2%', 'change' => '+0.5%', 'trend' => 'up'],
        ];

        $recentItems = [
            ['id' => 1, 'name' => 'Order #1042', 'status' => 'success', 'statusLabel' => 'Delivered', 'date' => '2026-02-08', 'amount' => '$129.90'],
            ['id' => 2, 'name' => 'Order #1041', 'status' => 'warning', 'statusLabel' => 'In progress', 'date' => '2026-02-07', 'amount' => '$249.00'],
            ['id' => 3, 'name' => 'Order #1040', 'status' => 'info', 'statusLabel' => 'Processing', 'date' => '2026-02-07', 'amount' => '$89.50'],
            ['id' => 4, 'name' => 'Order #1039', 'status' => 'success', 'statusLabel' => 'Delivered', 'date' => '2026-02-06', 'amount' => '$324.00'],
            ['id' => 5, 'name' => 'Order #1038', 'status' => 'danger', 'statusLabel' => 'Cancelled', 'date' => '2026-02-05', 'amount' => '$67.20'],
        ];

        return $this->render('pages/dashboard/index.html.twig', [
            'stats' => $stats,
            'recentItems' => $recentItems,
        ]);
    }
}
