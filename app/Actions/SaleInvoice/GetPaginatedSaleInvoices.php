<?php

namespace App\Actions\SaleInvoice;

use App\Http\Resources\SaleInvoice\SaleInvoiceResource;
use App\Enums\InvoiceStatus;
use App\Models\SaleInvoice;
use App\Support\PaginationHelper;

class GetPaginatedSaleInvoices
{
    public function execute(array $filters)
    {
        $query = SaleInvoice::with(['customer:id,name']);

        if ($filters['number']) {
            $query->where('invoice_number', 'like', "%{$filters['number']}%");
        }

        if ($filters['status'] === '0') {
            $query->where('status', InvoiceStatus::CREATED);
        } elseif ($filters['status'] === '1') {
            $query->where('status', InvoiceStatus::CONFIRMED);
        } elseif ($filters['status'] === '2') {
            $query->where('status', InvoiceStatus::CANCELLED);
        }

        if ($filters['dateFrom']) {
            $query->whereDate('invoice_date', '>=', $filters['dateFrom']);
        }

        if ($filters['dateTo']) {
            $query->whereDate('invoice_date', '<=', $filters['dateTo']);
        }

        $invoices = $query
            ->orderBy("invoice_date", "DESC")
            ->paginate(perPage: 10, page: $filters['page']);

        return [
            'saleInvoices' => $this->formatPagination($invoices),
            'filters' => $filters,
        ];
    }

    private function formatPagination($invoices): array
    {
        return PaginationHelper::format($invoices, SaleInvoiceResource::class);
    }
}