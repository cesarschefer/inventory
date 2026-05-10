<?php

namespace App\Actions\PurchaseInvoice;

use App\Http\Resources\PurchaseInvoice\PurchaseInvoiceResource;
use App\Enums\InvoiceStatus;
use App\Models\PurchaseInvoice;
use App\Support\PaginationHelper;

class GetPaginatedPurchaseInvoices
{
    public function execute(array $filters)
    {
        $query = PurchaseInvoice::with(['supplier:id,name']);

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
            'purchaseInvoices' => $this->formatPagination($invoices),
            'filters' => $filters,
        ];
    }

    private function formatPagination($invoices): array
    {
        return PaginationHelper::format($invoices, PurchaseInvoiceResource::class);
    }
}