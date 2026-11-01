<?php

namespace App\Controller;

use App\Form\DemoType;
use Knp\Component\Pager\PaginatorInterface;
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

    private const PAGE_SIZES = [5, 10, 25];

    /**
     * Server-side listing with KnpPaginator: only the current page is rendered.
     * With Doctrine, pass a QueryBuilder instead of an array: Knp adds LIMIT/OFFSET, COUNT and ORDER BY.
     */
    #[Route('', name: 'app_demo_index')]
    public function index(Request $request, PaginatorInterface $paginator): Response
    {
        $items = $this->getDemoItems();

        $categories = array_values(array_unique(array_column($items, 'category')));
        sort($categories);
        $category = $request->query->getString('category');
        if (!\in_array($category, $categories, true)) {
            $category = '';
        }
        if ('' !== $category) {
            $items = array_values(array_filter($items, static fn (array $item): bool => $item['category'] === $category));
        }

        $search = trim($request->query->getString('q'));
        if ('' !== $search) {
            $items = array_values(array_filter(
                $items,
                static fn (array $item): bool => false !== mb_stripos($item['name'].' '.$item['category'], $search),
            ));
        }

        $limit = $request->query->getInt('limit', self::PAGE_SIZES[0]);
        if (!\in_array($limit, self::PAGE_SIZES, true)) {
            $limit = self::PAGE_SIZES[0];
        }

        // Never sort on an arbitrary query parameter: allow-list the sortable fields.
        // An unknown field (hand-edited or outdated URL) falls back to the default sort instead of a 500 error.
        $sortable = ['[name]', '[category]', '[date]'];
        if (!\in_array($request->query->get('sort', $sortable[0]), $sortable, true)) {
            $request->query->remove('sort');
            $request->query->remove('direction');
        }

        $pagination = $paginator->paginate($items, $request->query->getInt('page', 1), $limit, [
            PaginatorInterface::SORT_FIELD_ALLOW_LIST => $sortable,
            PaginatorInterface::DEFAULT_SORT_FIELD_NAME => '[name]',
            PaginatorInterface::DEFAULT_SORT_DIRECTION => 'asc',
        ]);
        $pagination->setCustomParameters([
            'page_sizes' => self::PAGE_SIZES,
            'item_label' => 'demo.items',
        ]);

        return $this->render('pages/demo/index.html.twig', [
            'pagination' => $pagination,
            'search' => $search,
            'categories' => $categories,
            'category' => $category,
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

    /**
     * Destructive action: POST only, CSRF token checked (see ConfirmDialog component).
     */
    #[Route('/{id}/delete', name: 'app_demo_delete', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function delete(int $id, Request $request): Response
    {
        if (!$this->isCsrfTokenValid('delete-item-'.$id, $request->getPayload()->getString('_token'))) {
            $this->addFlash('error', 'The link has expired, please try again.');

            return $this->redirectToRoute('app_demo_show', ['id' => $id]);
        }

        $this->addFlash('success', 'Item deleted (demo — nothing is persisted).');

        return $this->redirectToRoute('app_demo_index', [], Response::HTTP_SEE_OTHER);
    }
}
