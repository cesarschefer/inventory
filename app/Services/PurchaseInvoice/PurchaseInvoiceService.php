<?php

namespace App\Services\PurchaseInvoice;

use App\Models\PurchaseInvoice;
use App\Enums\InvoiceStatus;
use Illuminate\Support\Facades\DB;

class PurchaseInvoiceService
{
    public function create(array $data): PurchaseInvoice
    {
        return DB::transaction(function () use ($data) {
            $invoice = PurchaseInvoice::create([
                'supplier_id' => $data['supplier_id'],
                'invoice_number' => $data['invoice_number'],
                'invoice_date' => $data['invoice_date'],
                'total' => $data['total'],
                'status' => InvoiceStatus::CREATED,
                'created_by' => auth()->id(),
            ]);

            $invoice->items()->createMany($data['items']);
            $invoice->stockMovements()->createMany(
                $this->buildStockMovements($data['items'])
            );

            return $invoice;
        });
    }

    public function update(PurchaseInvoice $invoice, array $data): PurchaseInvoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            $invoice->update([
                'supplier_id' => $data['supplier_id'],
                'invoice_number' => $data['invoice_number'],
                'invoice_date' => $data['invoice_date'],
                'total' => $data['total'],
            ]);

            $invoice->items()->delete();
            $invoice->items()->createMany($data['items']);

            $invoice->stockMovements()->delete();
            $invoice->stockMovements()->createMany(
                $this->buildStockMovements($data['items'])
            );

            return $invoice;
        });
    }

    private function buildStockMovements(array $items): array
    {
        return array_map(fn($item) => [
            'product_id' => $item['product_id'],
            'type' => 'purchase',
            'quantity' => $item['quantity'],
            'created_at' => now(),
            'updated_at' => now(),
        ], $items);
    }
}