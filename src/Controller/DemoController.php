<?php

namespace App\Controller;

use App\Form\DemoType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/demo')]
class DemoController extends AbstractController
{
    private function getDemoItems(): array
    {
        return [
            ['id' => 1, 'name' => 'Article Alpha', 'category' => 'Blog', 'status' => 'success', 'statusLabel' => 'Published', 'priority' => 'High', 'date' => '2026-02-01', 'color' => '#3b82f6'],
            ['id' => 2, 'name' => 'Landing Page Beta', 'category' => 'Marketing', 'status' => 'warning', 'statusLabel' => 'Draft', 'priority' => 'Medium', 'date' => '2026-02-03', 'color' => '#f59e0b'],
            ['id' => 3, 'name' => 'Newsletter Gamma', 'category' => 'Email', 'status' => 'info', 'statusLabel' => 'Scheduled', 'priority' => 'Low', 'date' => '2026-02-05', 'color' => '#0ea5e9'],
            ['id' => 4, 'name' => 'Campaign Delta', 'category' => 'Marketing', 'status' => 'success', 'statusLabel' => 'Published', 'priority' => 'High', 'date' => '2026-01-28', 'color' => '#22c55e'],
            ['id' => 5, 'name' => 'Guide Epsilon', 'category' => 'Documentation', 'status' => 'danger', 'statusLabel' => 'Archived', 'priority' => 'Low', 'date' => '2026-01-15', 'color' => '#ef4444'],
            ['id' => 6, 'name' => 'Tutorial Zeta', 'category' => 'Blog', 'status' => 'success', 'statusLabel' => 'Published', 'priority' => 'Medium', 'date' => '2026-02-06', 'color' => '#8b5cf6'],
            ['id' => 7, 'name' => 'Announcement Eta', 'category' => 'Communication', 'status' => 'warning', 'statusLabel' => 'Draft', 'priority' => 'High', 'date' => '2026-02-07', 'color' => '#ec4899'],
            ['id' => 8, 'name' => 'Report Theta', 'category' => 'Documentation', 'status' => 'info', 'statusLabel' => 'Scheduled', 'priority' => 'Medium', 'date' => '2026-02-08', 'color' => '#14b8a6'],
            ['id' => 9, 'name' => 'Study Iota', 'category' => 'Documentation', 'status' => 'success', 'statusLabel' => 'Published', 'priority' => 'Low', 'date' => '2026-01-20', 'color' => '#f97316'],
            ['id' => 10, 'name' => 'Presentation Kappa', 'category' => 'Marketing', 'status' => 'danger', 'statusLabel' => 'Archived', 'priority' => 'High', 'date' => '2026-01-10', 'color' => '#6366f1'],
            ['id' => 11, 'name' => 'Webinar Lambda', 'category' => 'Communication', 'status' => 'success', 'statusLabel' => 'Published', 'priority' => 'High', 'date' => '2026-02-02', 'color' => '#84cc16'],
            ['id' => 12, 'name' => 'Podcast Mu', 'category' => 'Communication', 'status' => 'warning', 'statusLabel' => 'Draft', 'priority' => 'Medium', 'date' => '2026-02-04', 'color' => '#a855f7'],
        ];
    }

    #[Route('', name: 'app_demo_index')]
    public function index(Request $request): Response
    {
        $items = $this->getDemoItems();
        $page = max(1, $request->query->getInt('page', 1));
        $perPage = 5;
        $totalPages = (int) ceil(count($items) / $perPage);
        $page = min($page, $totalPages);
        $pagedItems = array_slice($items, ($page - 1) * $perPage, $perPage);

        return $this->render('pages/demo/index.html.twig', [
            'items' => $pagedItems,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/{id}', name: 'app_demo_show', requirements: ['id' => '\d+'])]
    public function show(int $id): Response
    {
        $items = $this->getDemoItems();
        $item = null;
        foreach ($items as $i) {
            if ($i['id'] === $id) {
                $item = $i;
                break;
            }
        }

        if (!$item) {
            throw $this->createNotFoundException('Item not found.');
        }

        return $this->render('pages/demo/show.html.twig', [
            'item' => $item,
        ]);
    }

    #[Route('/new', name: 'app_demo_new', priority: 1)]
    public function new(Request $request): Response
    {
        $form = $this->createForm(DemoType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Item created successfully (demo — nothing is persisted).');

            return $this->redirectToRoute('app_demo_index');
        }

        return $this->render('pages/demo/new.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_demo_edit', requirements: ['id' => '\d+'])]
    public function edit(int $id, Request $request): Response
    {
        $items = $this->getDemoItems();
        $item = null;
        foreach ($items as $i) {
            if ($i['id'] === $id) {
                $item = $i;
                break;
            }
        }

        if (!$item) {
            throw $this->createNotFoundException('Item not found.');
        }

        $prefill = [
            'name' => $item['name'],
            'email' => 'contact@example.com',
            'description' => 'Short description of item ' . $item['name'],
            'richDescription' => '<p>Rich description of <strong>' . $item['name'] . '</strong> with HTML content.</p>',
            'category' => 'blog',
            'tags' => 'symfony,tailwind,demo',
            'publishedAt' => $item['date'],
            'color' => $item['color'],
            'active' => true,
            'priority' => 'high',
            'quantity' => 42,
        ];

        $form = $this->createForm(DemoType::class, $prefill);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Item updated successfully (demo — nothing is persisted).');

            return $this->redirectToRoute('app_demo_show', ['id' => $id]);
        }

        return $this->render('pages/demo/edit.html.twig', [
            'form' => $form,
            'item' => $item,
        ]);
    }
}
