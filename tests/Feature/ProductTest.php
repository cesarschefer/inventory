<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('product')]
class ProductTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_products(): void
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_products_index(): void
    {
        $this->user->givePermissionTo('view-products');
        Product::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('product/index')
            ->has('products.data', 5)
        );
    }

    public function test_authorized_users_can_create_products(): void
    {
        $this->user->givePermissionTo('create-products');
        $category = Category::factory()->create();

        $response = $this->actingAs($this->user)->post(route('products.store'), [
            'category_id' => $category->id,
            'name' => 'New Product',
            'sku' => 'PROD-001',
            'detail' => 'Product detail',
        ]);

        $response->assertRedirect(route('products.index'));
        $this->assertDatabaseHas('products', ['name' => 'New Product', 'sku' => 'PROD-001']);
    }

    public function test_authorized_users_can_update_products(): void
    {
        $this->user->givePermissionTo('edit-products');
        $product = Product::factory()->create();

        $response = $this->actingAs($this->user)->put(route('products.update', $product), [
            'category_id' => $product->category_id,
            'name' => 'Updated Product Name',
            'sku' => $product->sku,
            'detail' => 'Updated detail',
        ]);

        $response->assertRedirect(route('products.index'));
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Product Name']);
    }

    public function test_authorized_users_can_delete_products(): void
    {
        $this->user->givePermissionTo('delete-products');
        $product = Product::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('products.destroy', $product));

        $response->assertRedirect(route('products.index'));
        $this->assertSoftDeleted($product);
    }

    public function test_authorized_users_can_restore_products(): void
    {
        $this->user->givePermissionTo('edit-products');
        $product = Product::factory()->create(['deleted_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('products.restore', $product->id));

        $response->assertRedirect(route('products.index'));
        $this->assertDatabaseHas('products', ['id' => $product->id, 'deleted_at' => null]);
    }
}
