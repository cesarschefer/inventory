<?php

namespace App\Http\Controllers;

use App\Actions\Role\UpdateRolePermissions;
use App\Http\Requests\Role\UpdateRolePermissionRequest;
use Spatie\Permission\Models\Role;
use Illuminate\Http\RedirectResponse;

class RolePermissionController extends Controller
{
    public function __construct(
        private readonly UpdateRolePermissions $updateRolePermissions
    ) {
    }

    /**
     * Update the specified role's permissions.
     */
    public function __invoke(UpdateRolePermissionRequest $request, Role $role): RedirectResponse
    {
        $this->updateRolePermissions->execute($role, $request->input('permissions'));
        return back();
    }
}
