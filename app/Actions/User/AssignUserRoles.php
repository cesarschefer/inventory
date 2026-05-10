<?php

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class AssignUserRoles
{
    /**
     * Assign roles to a user.
     */
    public function execute(User $user, array $roleIds): User
    {
        return DB::transaction(function () use ($user, $roleIds) {
            $user->syncRoles($roleIds);
            return $user->load('roles');
        });
    }
}
