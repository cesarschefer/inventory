<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

#[Group('valid')]
#[Group('role')]
class RoleTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_roles(): void
    {
        $this->get(route('roles.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_roles_index(): void
    {
        $this->user->givePermissionTo('manage-roles');

        $response = $this->actingAs($this->user)->get(route('roles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('role/index')
            ->has('roles.data')
        );
    }

    public function test_roles_index_returns_available_permissions(): void
    {
        $this->user->givePermissionTo('manage-roles');

        $response = $this->actingAs($this->user)->get(route('roles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('availablePermissions')
        );
    }

    public function test_roles_index_returns_permissions_grouped(): void
    {
        $this->user->givePermissionTo('manage-roles');

        $response = $this->actingAs($this->user)->get(route('roles.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('availablePermissions.products')
            ->has('availablePermissions.categories')
            ->has('availablePermissions.customers')
        );
    }

    public function test_authorized_user_can_update_role_permissions(): void
    {
        $this->user->givePermissionTo('manage-roles');
        $role = Role::findByName('Inventory Manager');
        $permission1 = Permission::findByName('view-suppliers');
        $permission2 = Permission::findByName('create-purchases');

        $response = $this->actingAs($this->user)->put(route('roles.permissions.update', $role), [
            'permissions' => [$permission1->id, $permission2->id],
        ]);

        $response->assertRedirectBack();
        $this->assertTrue($role->hasPermissionTo('view-suppliers'));
        $this->assertTrue($role->hasPermissionTo('create-purchases'));
    }

    public function test_authorized_user_can_sync_role_permissions(): void
    {
        $this->user->givePermissionTo('manage-roles');
        $role = Role::findByName('Sales Representative');
        $oldPermission = Permission::findByName('view-products');
        $role->givePermissionTo($oldPermission);
        $newPermission = Permission::findByName('view-categories');

        $response = $this->actingAs($this->user)->put(route('roles.permissions.update', $role), [
            'permissions' => [$newPermission->id],
        ]);

        $response->assertRedirectBack();
        $this->assertFalse($role->hasPermissionTo('view-products'));
        $this->assertTrue($role->hasPermissionTo('view-categories'));
    }


    public function test_unauthorized_user_cannot_access_roles_index(): void
    {
        $response = $this->actingAs($this->user)->get(route('roles.index'));

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_update_role_permissions(): void
    {
        $role = Role::findByName('Standard User');
        $permission = Permission::findByName('import-data');

        $response = $this->actingAs($this->user)->put(route('roles.permissions.update', $role), [
            'permissions' => [$permission->id],
        ]);

        $response->assertStatus(403);
    }

}