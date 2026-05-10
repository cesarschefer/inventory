<?php

namespace App\Actions\Customer;

use App\Http\Resources\Customer\CustomerResource;
use App\Models\Customer;
use App\Support\PaginationHelper;

class GetPaginatedCustomers
{
    public function execute(array $filters)
    {
        $query = Customer::withTrashed();

        if ($filters['search']) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }
        if ($filters['tax_id']) {
            $query->where('tax_id', 'like', "{$filters['tax_id']}%");
        }

        if ($filters['status'] === '1') {
            $query->whereNull('deleted_at');
        } elseif ($filters['status'] === '2') {
            $query->whereNotNull('deleted_at');
        }

        if ($filters['customer_type'] === '1') {
            $query->where('customer_type', 1);
        } elseif ($filters['customer_type'] === '2') {
            $query->where('customer_type', 2);
        }

        $customers = $query
            ->orderBy("name", "ASC")
            ->paginate(perPage: 10, page: $filters['page']);

        return [
            'customers' => $this->formatPagination($customers),
            'counts' => $this->getCounts(),
            'filters' => $filters,
        ];
    }

    private function formatPagination($customers): array
    {
        return PaginationHelper::format($customers, CustomerResource::class);
    }

    private function getCounts(): array
    {
        return [
            'active' => Customer::count(),
            'inactive' => Customer::onlyTrashed()->count(),
        ];
    }
}