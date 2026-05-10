<?php

namespace App\Actions\StockMovement;

use App\Http\Resources\StockMovement\StockMovementResource;
use App\Models\Product;
use App\Models\StockMovement;
use App\Support\PaginationHelper;

class GetPaginatedStockMovements
{
    public function execute(array $filters): array
    {
        $productId = $filters['productId'] !== 'all' ? $filters['productId'] : null;

        $query = StockMovement::with(['product:id,name', 'document'])
            ->when($productId, fn($q) => $q->where('product_id', $productId))
            ->when($filters['dateFrom'], fn($q) => $q->whereDate('created_at', '>=', $filters['dateFrom']))
            ->when($filters['dateTo'], fn($q) => $q->whereDate('created_at', '<=', $filters['dateTo']));

        $movements = $query
            ->orderBy('created_at', 'desc')
            ->orderBy('product_id', 'asc')
            ->paginate(perPage: 20, page: $filters['page']);

        return [
            'stockMovements' => PaginationHelper::format($movements, StockMovementResource::class),
            'products' => Product::select('id', 'name')->orderBy('name')->get(),
            'totals' => $this->getTotals($productId, $filters),
            'filters' => $filters,
        ];
    }

    private function getTotals(?string $productId, array $filters): int
    {
        if (!$productId) {
            return 0;
        }

        return StockMovement::where('product_id', $productId)
            ->when($filters['dateFrom'], fn($q) => $q->whereDate('created_at', '>=', $filters['dateFrom']))
            ->when($filters['dateTo'], fn($q) => $q->whereDate('created_at', '<=', $filters['dateTo']))
            ->sum('quantity');
    }
}