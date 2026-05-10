<?php

namespace Tests\Unit\Actions\Role;

use App\Actions\Role\UpdateRolePermissions;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

#[Group('valid')]
#[Group('role')]
class UpdateRolePermissionsTest extends TestCase
{
    use RefreshDatabase;

    private UpdateRolePermissions $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
        $this->action = app(UpdateRolePermissions::class);
    }

    public function test_it_can_assign_permissions_to_role(): void
    {
        $role = Role::findByName('Inventory Manager');
        $permission1 = Permission::findByName('view-products');
        $permission2 = Permission::findByName('create-products');

        $this->action->execute($role, [$permission1->id, $permission2->id]);

        $this->assertTrue($role->hasPermissionTo($permission1));
        $this->assertTrue($role->hasPermissionTo($permission2));
    }

    public function test_it_can_sync_permissions_replacing_existing(): void
    {
        $role = Role::findByName('Inventory Manager');
        $oldPermission = Permission::findByName('view-products');
        $role->givePermissionTo($oldPermission);
        $newPermission = Permission::findByName('create-products');

        $this->action->execute($role, [$newPermission->id]);

        $this->assertFalse($role->hasPermissionTo($oldPermission));
        $this->assertTrue($role->hasPermissionTo($newPermission));
    }

    public function test_it_can_remove_all_permissions(): void
    {
        $role = Role::findByName('Inventory Manager');
        $permission = Permission::findByName('view-products');
        $role->givePermissionTo($permission);

        $this->action->execute($role, []);

        $this->assertFalse($role->hasPermissionTo($permission));
        $this->assertCount(0, $role->permissions);
    }

    public function test_it_can_assign_single_permission(): void
    {
        $role = Role::findByName('Standard User');
        $permission = Permission::findByName('view-products');

        $this->action->execute($role, [$permission->id]);

        $this->assertTrue($role->hasPermissionTo($permission));
    }

    public function test_it_syncs_permissions_correctly(): void
    {
        $role = Role::findByName('Sales Representative');
        $permission1 = Permission::findByName('view-products');
        $permission2 = Permission::findByName('view-categories');
        $role->givePermissionTo($permission1);

        $this->action->execute($role, [$permission1->id, $permission2->id]);

        $this->assertCount(2, $role->fresh()->permissions);
        $this->assertTrue($role->hasPermissionTo($permission1));
        $this->assertTrue($role->hasPermissionTo($permission2));
    }
}