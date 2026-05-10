<?php

namespace Database\Factories;

use App\Models\PurchaseInvoice;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\SaleInvoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['purchase', 'sale']);

        return [
            'product_id'    => Product::factory(),
            'type'          => $type,
            'quantity'      => $this->quantityForType($type),
            'document_id'   => $this->faker->numberBetween(1, 100),
            'document_type' => $this->faker->randomElement([
                PurchaseInvoice::class,
                SaleInvoice::class,
            ]),
        ];
    }

    private function quantityForType(string $type): int
    {
        return match ($type) {
            'purchase' => $this->faker->numberBetween(1, 500),
            'sale'     => $this->faker->numberBetween(-500, -1),
        };
    }
}