<?php

namespace App\Http\Controllers;

use App\Actions\User\GetPaginatedUsers;
use App\Http\Requests\User\IndexUserRequest;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(
        private readonly GetPaginatedUsers $getPaginatedUsers
    ) {
    }

    /**
     * Display a list of paginated users
     */
    public function __invoke(IndexUserRequest $request): Response
    {
        $result = $this->getPaginatedUsers->execute($request->filters());

        return Inertia::render('user/index', [
            'users' => $result['users'],
            'filters' => $result['filters'],
            'availableRoles' => Role::all(['id', 'name']),
        ]);
    }
}
