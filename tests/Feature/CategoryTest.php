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
#[Group('category')]
class CategoryTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_categories(): void
    {
        $this->get(route('categories.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_categories_index(): void
    {
        $this->user->givePermissionTo('view-categories');
        Category::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('category/index')
            ->has('categories.data', 5)
            ->has('filters')
            ->has('counts')
        );
    }

    public function test_authorized_users_can_create_categories(): void
    {
        $this->user->givePermissionTo('create-categories');

        $response = $this->actingAs($this->user)->post(route('categories.store'), [
            'name' => 'New Category',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', ['name' => 'New Category']);
    }

    public function test_authorized_users_can_update_categories(): void
    {
        $this->user->givePermissionTo('edit-categories');
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->user)->put(route('categories.update', $category), [
            'name' => 'Updated Name',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Updated Name']);
    }

    public function test_authorized_users_can_delete_categories_without_products(): void
    {
        $this->user->givePermissionTo('delete-categories');
        $category = Category::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('categories.destroy', $category));

        $response->assertRedirect(route('categories.index'));
        $this->assertSoftDeleted($category);
    }

    public function test_cannot_delete_categories_with_associated_products(): void
    {
        $this->user->givePermissionTo('delete-categories');
        $category = Category::factory()->create();
        Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->user)->delete(route('categories.destroy', $category));

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'deleted_at' => null]);
    }

    public function test_authorized_users_can_restore_categories(): void
    {
        $this->user->givePermissionTo('edit-categories');
        
        $category = Category::factory()->create(['deleted_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('categories.restore', $category->id));

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'deleted_at' => null]);
    }
}
