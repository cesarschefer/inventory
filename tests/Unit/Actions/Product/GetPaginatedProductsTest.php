<?php

namespace Tests\Unit\Actions\Product;

use App\Actions\Product\GetPaginatedProducts;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('product')]
class GetPaginatedProductsTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedProducts $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedProducts::class);
    }

    public function test_it_can_get_paginated_products(): void
    {
        Product::factory()->count(15)->create();

        $result = $this->action->execute([
            'search' => '',
            'sku' => '',
            'category_id' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(10, $result['products']['data']);
        $this->assertEquals(15, $result['products']['total']);
    }

    public function test_it_can_filter_products_by_search(): void
    {
        Product::factory()->create(['name' => 'MacBook Pro']);
        Product::factory()->create(['name' => 'iPhone 15']);

        $result = $this->action->execute([
            'search' => 'MacBook',
            'sku' => '',
            'category_id' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['products']['data']);
        $this->assertEquals('MacBook Pro', $result['products']['data'][0]['name']);
    }

    public function test_it_can_filter_products_by_category(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);
        Product::factory()->count(2)->create();

        $result = $this->action->execute([
            'search' => '',
            'sku' => '',
            'category_id' => $category->id,
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(3, $result['products']['data']);
    }

    public function test_it_can_filter_products_by_status(): void
    {
        Product::factory()->count(5)->create();
        Product::factory()->count(3)->create(['deleted_at' => now()]);

        // Active
        $activeResult = $this->action->execute([
            'search' => '',
            'sku' => '',
            'category_id' => '',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(5, $activeResult['products']['data']);

        // Inactive
        $inactiveResult = $this->action->execute([
            'search' => '',
            'sku' => '',
            'category_id' => '',
            'status' => '2',
            'page' => 1,
        ]);
        $this->assertCount(3, $inactiveResult['products']['data']);
    }

    public function test_it_can_filter_products_by_sku(): void
    {
        Product::factory()->create(['sku' => 'PROD-1234']);
        Product::factory()->create(['sku' => 'PROD-9999']);

        $result = $this->action->execute([
            'search' => '',
            'sku' => 'PROD-1234',
            'category_id' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['products']['data']);
        $this->assertEquals('PROD-1234', $result['products']['data'][0]['sku']);
    }
}
