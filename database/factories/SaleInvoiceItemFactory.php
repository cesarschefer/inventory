<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\SaleInvoice;
use App\Models\SaleInvoiceItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleInvoiceItemFactory extends Factory
{
    protected $model = SaleInvoiceItem::class;

    public function definition(): array
    {
        $quantity   = $this->faker->numberBetween(1, 100);
        $unitPrice  = $this->faker->randomFloat(2, 1, 500);

        return [
            'sale_invoice_id' => SaleInvoice::factory(),
            'product_id'       => Product::factory(),
            'quantity'        => $quantity,
            'unit_price'      => $unitPrice,
            'subtotal'        => round($quantity * $unitPrice, 2),
            'total'           => round($quantity * $unitPrice, 2),
        ];
    }
}