<?php

namespace App\Actions\Product;

use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use App\Models\Category;
use App\Support\PaginationHelper;

class GetPaginatedProducts
{
    public function execute(array $filters)
    {
        $query = Product::withTrashed()->with(['category:id,name']);

        if ($filters['search']) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }
        if ($filters['sku']) {
            $query->where('sku', 'like', "%{$filters['sku']}%");
        }
        if ($filters['status'] === '1') {
            $query->whereNull('deleted_at');
        } elseif ($filters['status'] === '2') {
            $query->whereNotNull('deleted_at');
        }

        if ($filters['category_id'] && $filters['category_id'] !== 'all') {
            $query->where('category_id', '=', $filters['category_id']);
        }

        $products = $query
            ->orderBy("name", "ASC")
            ->paginate(perPage: 10, page: $filters['page']);

        $categories = Category::all(['id', 'name']);

        return [
            'products' => $this->formatPagination($products),
            'categories' => $categories,
            'counts' => $this->getCounts(),
            'filters' => $filters,
        ];
    }

    private function formatPagination($products): array
    {
        return PaginationHelper::format($products, ProductResource::class);
    }

    private function getCounts(): array
    {
        return [
            'active' => Product::count(),
            'inactive' => Product::onlyTrashed()->count(),
        ];
    }
}