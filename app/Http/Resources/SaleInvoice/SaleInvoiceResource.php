<?php

namespace App\Http\Resources\SaleInvoice;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleInvoiceResource extends JsonResource
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
            'customer' => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
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
                'discount_type' => $item->discount_type,
                'discount' => $item->discount,
                'total' => $item->total,
            ])
        ];
    }
}
