<?php

namespace App\Http\Controllers;

use App\Actions\User\AssignUserRoles;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserRoleController extends Controller
{
    public function __construct(
        private readonly AssignUserRoles $assignUserRoles
    ) {
    }

    /**
     * Update the specified user's roles.
     */
    public function __invoke(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $this->assignUserRoles->execute($user, $request->input('roles'));
        return back();
    }
}
