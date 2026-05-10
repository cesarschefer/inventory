<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Customer;
use App\Models\SaleInvoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleInvoiceFactory extends Factory
{
    protected $model = SaleInvoice::class;

    public function definition(): array
    {
        return [
            'customer_id'    => Customer::factory(),
            'invoice_number' => $this->faker->unique()->bothify('SALE-####'),
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