<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('supplier')]
class SupplierTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_suppliers(): void
    {
        $this->get(route('suppliers.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_suppliers_index(): void
    {
        $this->user->givePermissionTo('view-suppliers');
        Supplier::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('suppliers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('supplier/index')
            ->has('suppliers.data', 5)
        );
    }

    public function test_authorized_users_can_create_suppliers(): void
    {
        $this->user->givePermissionTo('create-suppliers');

        $response = $this->actingAs($this->user)->post(route('suppliers.store'), [
            'name' => 'Tech Supply',
            'tax_id' => '9876543210',
            'email' => 'tech@example.com',
            'phone' => '987654321',
            'state' => 'State',
            'city' => 'City',
            'address' => 'Address',
        ]);

        $response->assertRedirect(route('suppliers.index'));
        $this->assertDatabaseHas('suppliers', ['name' => 'Tech Supply', 'tax_id' => '9876543210']);
    }

    public function test_authorized_users_can_update_suppliers(): void
    {
        $this->user->givePermissionTo('edit-suppliers');
        $supplier = Supplier::factory()->create();

        $response = $this->actingAs($this->user)->put(route('suppliers.update', $supplier), [
            'name' => 'Updated Tech Supply',
            'tax_id' => $supplier->tax_id,
            'email' => 'updated@example.com',
            'phone' => $supplier->phone,
            'state' => $supplier->state,
            'city' => $supplier->city,
            'address' => $supplier->address,
        ]);

        $response->assertRedirect(route('suppliers.index'));
        $this->assertDatabaseHas('suppliers', ['id' => $supplier->id, 'name' => 'Updated Tech Supply']);
    }

    public function test_authorized_users_can_delete_suppliers(): void
    {
        $this->user->givePermissionTo('delete-suppliers');
        $supplier = Supplier::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('suppliers.destroy', $supplier));

        $response->assertRedirect(route('suppliers.index'));
        $this->assertSoftDeleted($supplier);
    }

    public function test_authorized_users_can_restore_suppliers(): void
    {
        $this->user->givePermissionTo('edit-suppliers');
        $supplier = Supplier::factory()->create(['deleted_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('suppliers.restore', $supplier->id));

        $response->assertRedirect(route('suppliers.index'));
        $this->assertDatabaseHas('suppliers', ['id' => $supplier->id, 'deleted_at' => null]);
    }
}
