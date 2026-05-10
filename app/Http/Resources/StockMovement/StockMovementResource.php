<?php

namespace App\Http\Resources\StockMovement;

use App\Models\PurchaseInvoice;
use App\Models\SaleInvoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => $this->whenLoaded('product', fn() => [
                'id' => $this->product->id,
                'name' => $this->product->name,
            ]),
            'type' => $this->type,
            'quantity' => $this->quantity,
            'document' => $this->whenLoaded('document', fn() => [
                'id' => $this->document->id,
                'name' => $this->document->invoice_number ?? '',
            ]),
            'document_type' => $this->resolveDocumentType(),
            'formatted_date' => $this->formatted_date,
            'created_at' => $this->created_at,
        ];
    }

    private function resolveDocumentType(): string
    {
        return match ($this->document_type) {
            PurchaseInvoice::class => 'purchase',
            SaleInvoice::class => 'sale',
            default => $this->document_type ?? '',
        };
    }
}