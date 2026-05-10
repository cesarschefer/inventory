<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\PurchaseInvoice;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseInvoice>
 */
class PurchaseInvoiceFactory extends Factory
{
    protected $model = PurchaseInvoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'supplier_id'    => Supplier::factory(),
            'invoice_number' => $this->faker->unique()->bothify('INV-####'),
            'invoice_date'   => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'total'          => $this->faker->randomFloat(2, 100, 10000),
            'status'         => InvoiceStatus::CREATED->value,
            'created_by'     => User::factory(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn () => ['status' => InvoiceStatus::CONFIRMED->value]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => ['status' => InvoiceStatus::CANCELLED->value]);
    }
}
