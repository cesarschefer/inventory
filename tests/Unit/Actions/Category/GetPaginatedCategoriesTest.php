<?php

namespace Tests\Unit\Actions\Category;

use App\Actions\Category\GetPaginatedCategories;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('category')]
class GetPaginatedCategoriesTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedCategories $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedCategories::class);
    }

    public function test_it_can_get_paginated_categories(): void
    {
        Category::factory()->count(15)->create();

        $result = $this->action->execute([
            'search' => '',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(10, $result['categories']['data']);
        $this->assertEquals(15, $result['categories']['total']);
        $this->assertEquals(15, $result['counts']['active']);
    }

    public function test_it_can_filter_categories_by_search(): void
    {
        Category::factory()->create(['name' => 'Electronic']);
        Category::factory()->create(['name' => 'Furniture']);

        $result = $this->action->execute([
            'search' => 'Elect',
            'status' => '1',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['categories']['data']);
        $this->assertEquals('Electronic', $result['categories']['data'][0]['name']);
    }

    public function test_it_can_filter_categories_by_status(): void
    {
        Category::factory()->count(5)->create();
        Category::factory()->count(3)->create(['deleted_at' => now()]);

        // Active
        $activeResult = $this->action->execute([
            'search' => '',
            'status' => '1',
            'page' => 1,
        ]);
        $this->assertCount(5, $activeResult['categories']['data']);

        // Inactive (Trashed)
        $inactiveResult = $this->action->execute([
            'search' => '',
            'status' => '2',
            'page' => 1,
        ]);
        $this->assertCount(3, $inactiveResult['categories']['data']);
        
        $this->assertEquals(5, $activeResult['counts']['active']);
        $this->assertEquals(3, $activeResult['counts']['inactive']);
    }
}
