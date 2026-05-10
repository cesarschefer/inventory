<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseInvoiceItem>
 */
class PurchaseInvoiceItemFactory extends Factory
{
    protected $model = PurchaseInvoiceItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity   = $this->faker->numberBetween(1, 100);
        $unitPrice  = $this->faker->randomFloat(2, 1, 500);

        return [
            'purchase_invoice_id' => PurchaseInvoice::factory(),
            'product_id'          => Product::factory(),
            'quantity'            => $quantity,
            'unit_price'          => $unitPrice,
            'subtotal'            => round($quantity * $unitPrice, 2),
        ];
    }
}
