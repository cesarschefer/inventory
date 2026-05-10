<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('stock-movement')]
class StockMovementTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_stock_movements(): void
    {
        $this->get(route('stock-movements.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_stock_movements_index(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        StockMovement::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('stock-movement/index')
            ->has('stockMovements.data', 5)
        );
    }

    public function test_stock_movements_index_includes_products_list(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        $product = Product::factory()->create();
        StockMovement::factory()->create(['product_id' => $product->id]);

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->where('products.0.id', $product->id)
            ->where('products.0.name', $product->name)
        );
    }

    public function test_stock_movements_index_returns_filters(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        StockMovement::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('filters')
            ->where('filters.productId', 'all')
        );
    }

    public function test_stock_movements_includes_totals(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        $product = Product::factory()->create();
        StockMovement::factory()->count(2)->create([
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->where('totals', 0)
        );
    }

    public function test_stock_movements_can_be_filtered_by_product(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        $product = Product::factory()->create();
        StockMovement::factory()->count(3)->create(['product_id' => $product->id]);
        StockMovement::factory()->count(2)->create();

        $response = $this->actingAs($this->user)->get(route('stock-movements.index', ['productId' => $product->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('stockMovements.data', 3)
        );
    }

    public function test_stock_movements_can_be_filtered_by_date(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        StockMovement::factory()->create(['created_at' => now()->subDays(10)]);
        StockMovement::factory()->create(['created_at' => now()]);

        $response = $this->actingAs($this->user)->get(route('stock-movements.index', [
            'dateFrom' => now()->subDays(5)->toDateString(),
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('stockMovements.data', 1)
        );
    }

    public function test_stock_movements_includes_product_info(): void
    {
        $this->user->givePermissionTo('view-stock-movements');
        $product = Product::factory()->create(['name' => 'Test Product']);
        $movement = StockMovement::factory()->create(['product_id' => $product->id]);

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->where('stockMovements.data.0.product.name', 'Test Product')
        );
    }

    public function test_unauthorized_users_cannot_access_stock_movements(): void
    {
        StockMovement::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('stock-movements.index'));

        $response->assertStatus(403);
    }
}