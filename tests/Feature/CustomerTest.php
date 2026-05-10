<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('customer')]
class CustomerTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_customers(): void
    {
        $this->get(route('customers.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_customers_index(): void
    {
        $this->user->givePermissionTo('view-customers');
        Customer::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('customer/index')
            ->has('customers.data', 5)
        );
    }

    public function test_authorized_users_can_create_customers(): void
    {
        $this->user->givePermissionTo('create-customers');

        $response = $this->actingAs($this->user)->post(route('customers.store'), [
            'name' => 'John Doe',
            'tax_id' => '1234567890',
            'email' => 'john@example.com',
            'phone' => '123456789',
            'state' => 'State',
            'city' => 'City',
            'address' => 'Address',
            'customer_type' => 1,
        ]);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customers', ['name' => 'John Doe', 'tax_id' => '1234567890']);
    }

    public function test_authorized_users_can_update_customers(): void
    {
        $this->user->givePermissionTo('edit-customers');
        $customer = Customer::factory()->create();

        $response = $this->actingAs($this->user)->put(route('customers.update', $customer), [
            'name' => 'Jane Doe',
            'tax_id' => $customer->tax_id,
            'email' => 'jane_updated@example.com',
            'phone' => $customer->phone,
            'state' => $customer->state,
            'city' => $customer->city,
            'address' => $customer->address,
            'customer_type' => 1,
        ]);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'name' => 'Jane Doe']);
    }

    public function test_authorized_users_can_delete_customers(): void
    {
        $this->user->givePermissionTo('delete-customers');
        $customer = Customer::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('customers.destroy', $customer));

        $response->assertRedirect(route('customers.index'));
        $this->assertSoftDeleted($customer);
    }

    public function test_authorized_users_can_restore_customers(): void
    {
        $this->user->givePermissionTo('edit-customers');
        $customer = Customer::factory()->create(['deleted_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('customers.restore', $customer->id));

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'deleted_at' => null]);
    }
}
