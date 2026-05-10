<?php

namespace App\Actions\Supplier;

use App\Http\Resources\Supplier\SupplierResource;
use App\Models\Supplier;
use App\Support\PaginationHelper;

class GetPaginatedSuppliers
{
    public function execute(array $filters)
    {
        $query = Supplier::withTrashed();

        if ($filters['search']) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if ($filters['status'] === '1') {
            $query->whereNull('deleted_at');
        } elseif ($filters['status'] === '2') {
            $query->whereNotNull('deleted_at');
        }

        if ($filters['tax_id']) {
            $query->where('tax_id', 'like', "{$filters['tax_id']}%");
        }

        $suppliers = $query
            ->orderBy("name", "ASC")
            ->paginate(perPage: 10, page: $filters['page']);

        return [
            'suppliers' => $this->formatPagination($suppliers),
            'counts' => $this->getCounts(),
            'filters' => $filters,
        ];
    }

    private function formatPagination($suppliers): array
    {
        return PaginationHelper::format($suppliers, SupplierResource::class);
    }

    private function getCounts(): array
    {
        return [
            'active' => Supplier::count(),
            'inactive' => Supplier::onlyTrashed()->count(),
        ];
    }
}