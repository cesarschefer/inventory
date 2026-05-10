<?php

namespace Tests\Unit\Actions\Customer;

use App\Actions\Customer\GetPaginatedCustomers;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('customer')]
class GetPaginatedCustomersTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedCustomers $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedCustomers::class);
    }

    public function test_it_can_get_paginated_customers(): void
    {
        Customer::factory()->count(15)->create();

        $result = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'customer_type' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(10, $result['customers']['data']);
        $this->assertEquals(15, $result['customers']['total']);
    }

    public function test_it_can_filter_customers_by_search(): void
    {
        Customer::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        Customer::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

        $result = $this->action->execute([
            'search' => 'John',
            'tax_id' => '',
            'customer_type' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['customers']['data']);
        $this->assertEquals('John Doe', $result['customers']['data'][0]['name']);
    }

    public function test_it_can_filter_customers_by_status(): void
    {
        Customer::factory()->count(5)->create();
        Customer::factory()->count(3)->create(['deleted_at' => now()]);

        // Active
        $activeResult = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'customer_type' => '',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(5, $activeResult['customers']['data']);

        // Inactive
        $inactiveResult = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'customer_type' => '',
            'status' => '2',
            'page' => 1,
        ]);
        $this->assertCount(3, $inactiveResult['customers']['data']);
    }

    public function test_it_can_filter_customers_by_tax_id(): void
    {
        Customer::factory()->create(['tax_id' => '12345678901']);
        Customer::factory()->create(['tax_id' => '99999999999']);

        $result = $this->action->execute([
            'search' => '',
            'tax_id' => '12345',
            'customer_type' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['customers']['data']);
        $this->assertEquals('12345678901', $result['customers']['data'][0]['tax_id']);
    }

    public function test_it_can_filter_customers_by_customer_type(): void
    {
        Customer::factory()->count(3)->create(['customer_type' => 1]); // Individual
        Customer::factory()->count(2)->create(['customer_type' => 2]); // Company

        $individuals = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'customer_type' => '1',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(3, $individuals['customers']['data']);

        $companies = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'customer_type' => '2',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(2, $companies['customers']['data']);
    }
}
