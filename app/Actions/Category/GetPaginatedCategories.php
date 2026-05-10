<?php

namespace App\Actions\Category;

use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use App\Support\PaginationHelper;

class GetPaginatedCategories
{
    public function execute(array $filters)
    {
        $query = Category::withTrashed();

        if ($filters['search']) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if ($filters['status'] === '1') {
            $query->whereNull('deleted_at');
        } elseif ($filters['status'] === '2') {
            $query->whereNotNull('deleted_at');
        }

        $categories = $query
            ->orderBy("name", "ASC")
            ->paginate(perPage: 10, page: $filters['page']);

        return [
            'categories' => $this->formatPagination($categories),
            'counts' => $this->getCounts(),
            'filters' => $filters,
        ];
    }

    private function formatPagination($categories): array
    {
        return PaginationHelper::format($categories, CategoryResource::class);
    }

    private function getCounts(): array
    {
        return [
            'active' => Category::count(),
            'inactive' => Category::onlyTrashed()->count(),
        ];
    }
}