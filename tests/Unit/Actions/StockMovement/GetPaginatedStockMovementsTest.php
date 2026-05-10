<?php

namespace Tests\Unit\Actions\StockMovement;

use App\Actions\StockMovement\GetPaginatedStockMovements;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('stock-movement')]
class GetPaginatedStockMovementsTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedStockMovements $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedStockMovements::class);
    }

    public function test_it_can_get_paginated_stock_movements(): void
    {
        StockMovement::factory()->count(25)->create();

        $result = $this->action->execute([
            'productId' => 'all',
            'dateFrom' => '',
            'dateTo' => '',
            'page' => 1,
        ]);

        $this->assertCount(20, $result['stockMovements']['data']);
        $this->assertEquals(25, $result['stockMovements']['total']);
    }

    public function test_it_can_filter_stock_movements_by_product(): void
    {
        $product = Product::factory()->create();
        StockMovement::factory()->count(3)->create(['product_id' => $product->id]);
        StockMovement::factory()->count(2)->create();

        $result = $this->action->execute([
            'productId' => $product->id,
            'dateFrom' => '',
            'dateTo' => '',
            'page' => 1,
        ]);

        $this->assertCount(3, $result['stockMovements']['data']);
    }

    public function test_it_can_filter_stock_movements_by_date_from(): void
        {
            $oldMovement = StockMovement::factory()->create(['created_at' => now()->subDays(10)]);
            $recentMovement = StockMovement::factory()->create(['created_at' => now()]);

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => now()->subDays(5)->toDateString(),
                'dateTo' => '',
                'page' => 1,
            ]);

            $this->assertCount(1, $result['stockMovements']['data']);
            $this->assertEquals($recentMovement->id, $result['stockMovements']['data'][0]['id']);
        }

        public function test_it_can_filter_stock_movements_by_date_to(): void
        {
            $oldMovement = StockMovement::factory()->create(['created_at' => now()->subDays(10)]);
            $recentMovement = StockMovement::factory()->create(['created_at' => now()]);

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => '',
                'dateTo' => now()->subDays(5)->toDateString(),
                'page' => 1,
            ]);

            $this->assertCount(1, $result['stockMovements']['data']);
            $this->assertEquals($oldMovement->id, $result['stockMovements']['data'][0]['id']);
        }

        public function test_it_can_filter_by_date_range(): void
        {
            StockMovement::factory()->create(['created_at' => now()->subDays(20)]);
            StockMovement::factory()->create(['created_at' => now()->subDays(10)]);
            StockMovement::factory()->create(['created_at' => now()]);

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => now()->subDays(15)->toDateString(),
                'dateTo' => now()->subDays(5)->toDateString(),
                'page' => 1,
            ]);

            $this->assertCount(1, $result['stockMovements']['data']);
        }

        public function test_it_returns_products_list(): void
        {
            StockMovement::factory()->count(3)->create();

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => '',
                'dateTo' => '',
                'page' => 1,
            ]);

            $this->assertNotEmpty($result['products']);
            $this->assertArrayHasKey('id', $result['products']->first());
            $this->assertArrayHasKey('name', $result['products']->first());
        }

        public function test_it_calculates_totals_for_specific_product(): void
        {
            $product = Product::factory()->create();
            StockMovement::factory()->count(3)->create(['product_id' => $product->id, 'quantity' => 10]);
            StockMovement::factory()->count(2)->create(['product_id' => $product->id, 'quantity' => 5]);

            $result = $this->action->execute([
                'productId' => $product->id,
                'dateFrom' => '',
                'dateTo' => '',
                'page' => 1,
            ]);

            $this->assertEquals(40, $result['totals']);
        }

        public function test_it_returns_zero_totals_for_all_products(): void
        {
            StockMovement::factory()->count(3)->create();

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => '',
                'dateTo' => '',
                'page' => 1,
            ]);

            $this->assertEquals(0, $result['totals']);
        }

        public function test_it_orders_by_created_at_desc(): void
        {
            $movement1 = StockMovement::factory()->create(['created_at' => now()->subDays(2)]);
            $movement2 = StockMovement::factory()->create(['created_at' => now()->subDays(1)]);
            $movement3 = StockMovement::factory()->create(['created_at' => now()]);

            $result = $this->action->execute([
                'productId' => 'all',
                'dateFrom' => '',
                'dateTo' => '',
                'page' => 1,
            ]);

            $this->assertEquals($movement3->id, $result['stockMovements']['data'][0]['id']);
            $this->assertEquals($movement2->id, $result['stockMovements']['data'][1]['id']);
            $this->assertEquals($movement1->id, $result['stockMovements']['data'][2]['id']);
        }
}