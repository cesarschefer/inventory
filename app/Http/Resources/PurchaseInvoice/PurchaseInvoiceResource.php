<?php

namespace App\Http\Resources\PurchaseInvoice;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseInvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'supplier' => [
                'id' => $this->supplier->id,
                'name' => $this->supplier->name,
            ],
            'number' => $this->invoice_number,
            'date' => $this->invoice_date->format('Y-m-d'),
            'formatted_date' => $this->formatted_date,
            'total' => $this->total,
            'status' => $this->status,
            'items' => $this->items->map(fn($item) => [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
            ])
        ];
    }
}
