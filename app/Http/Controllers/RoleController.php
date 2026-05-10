<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    /**
     * Display a list of roles
     */
    public function __invoke(\Illuminate\Http\Request $request): Response
    {
        $availablePermissions = Permission::all()->groupBy(function ($permission) {
            $parts = explode('-', $permission->name);
            return count($parts) > 1 
                ? implode(' ', array_slice($parts, 1)) 
                : 'system';
        });

        return Inertia::render('role/index', [
            'roles' => Role::with('permissions')->paginate(10),
            'availablePermissions' => $availablePermissions,
            'filters' => [
                'page' => $request->integer('page', 1),
            ],
        ]);
    }
}
