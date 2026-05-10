<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Role;

class UpdateRolePermissions
{
    /**
     * Sync permissions to the specified role.
     */
    public function execute(Role $role, array $permissionIds): void
    {
        $role->syncPermissions($permissionIds);
    }
}
