<?php
namespace App\Services\SaleInvoice;

use App\Models\SaleInvoice;
use App\Models\StockMovement;
use App\Enums\InvoiceStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleInvoiceService
{
    public function create(array $data): SaleInvoice
    {
        return DB::transaction(function () use ($data) {
            $this->validateStock($data['items']);

            $invoice = SaleInvoice::create([
                'customer_id'    => $data['customer_id'],
                'invoice_number' => $data['invoice_number'],
                'invoice_date'   => $data['invoice_date'],
                'total'          => $data['total'],
                'status'         => InvoiceStatus::CREATED,
                'created_by'     => auth()->id(),
            ]);

            $invoice->items()->createMany($data['items']);
            $invoice->stockMovements()->createMany(
                $this->buildStockMovements($data['items'])
            );

            return $invoice;
        });
    }

    public function update(SaleInvoice $invoice, array $data): SaleInvoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            $this->validateStock($data['items'], $invoice);

            $invoice->update([
                'customer_id'    => $data['customer_id'],
                'invoice_number' => $data['invoice_number'],
                'invoice_date'   => $data['invoice_date'],
                'total'          => $data['total'],
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

    private function validateStock(array $items, ?SaleInvoice $excludeInvoice = null): void
    {
        $requestedQuantities = [];
        foreach ($items as $item) {
            $productId = $item['product_id'];
            $requestedQuantities[$productId] = ($requestedQuantities[$productId] ?? 0) + $item['quantity'];
        }

        foreach ($requestedQuantities as $productId => $totalQuantity) {
            $query = StockMovement::where('product_id', $productId);

            if ($excludeInvoice) {
                $query->where(function ($q) use ($excludeInvoice) {
                    $q->where('document_type', '!=', SaleInvoice::class)
                        ->orWhere('document_id', '!=', $excludeInvoice->id);
                });
            }

            $stock = $query->lockForUpdate()->sum('quantity');

            if ($stock < $totalQuantity) {
                throw ValidationException::withMessages([
                    'message' => "Insufficient stock for product ID {$productId}. Available: {$stock}, requested: {$totalQuantity}.",
                ]);
            }
        }
    }

    private function buildStockMovements(array $items): array
    {
        return array_map(fn($item) => [
            'product_id' => $item['product_id'],
            'type'       => 'sale',
            'quantity'   => -1 * $item['quantity'],
        ], $items);
    }
}