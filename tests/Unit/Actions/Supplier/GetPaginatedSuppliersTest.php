<?php

namespace Tests\Unit\Actions\Supplier;

use App\Actions\Supplier\GetPaginatedSuppliers;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('supplier')]
class GetPaginatedSuppliersTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedSuppliers $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedSuppliers::class);
    }

    public function test_it_can_get_paginated_suppliers(): void
    {
        Supplier::factory()->count(15)->create();

        $result = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(10, $result['suppliers']['data']);
        $this->assertEquals(15, $result['suppliers']['total']);
    }

    public function test_it_can_get_paginated_suppliers_second_page(): void
    {
        Supplier::factory()->count(15)->create();

        $result = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'status' => '1',
            'page' => 2,
        ]);

        $this->assertCount(5, $result['suppliers']['data']);
        $this->assertEquals(15, $result['suppliers']['total']);
    }

    public function test_it_can_filter_suppliers_by_search(): void
    {
        Supplier::factory()->create(['name' => 'Tech Supply Co']);
        Supplier::factory()->create(['name' => 'Office Depo']);

        $result = $this->action->execute([
            'search' => 'Tech',
            'tax_id' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['suppliers']['data']);
        $this->assertEquals('Tech Supply Co', $result['suppliers']['data'][0]['name']);
    }

    public function test_it_can_filter_suppliers_by_status(): void
    {
        Supplier::factory()->count(5)->create();
        Supplier::factory()->count(3)->create(['deleted_at' => now()]);

        // Active
        $activeResult = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(5, $activeResult['suppliers']['data']);

        // Inactive
        $inactiveResult = $this->action->execute([
            'search' => '',
            'tax_id' => '',
            'status' => '2',
            'page' => 1,
        ]);
        $this->assertCount(3, $inactiveResult['suppliers']['data']);
    }

    public function test_it_can_filter_suppliers_by_tax_id(): void
    {
        Supplier::factory()->create(['tax_id' => '98765432100']);
        Supplier::factory()->create(['tax_id' => '11111111111']);

        $result = $this->action->execute([
            'search' => '',
            'tax_id' => '98765',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['suppliers']['data']);
        $this->assertEquals('98765432100', $result['suppliers']['data'][0]['tax_id']);
    }
}
