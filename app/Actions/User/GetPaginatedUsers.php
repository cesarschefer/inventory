<?php

namespace App\Actions\User;

use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Support\PaginationHelper;

class GetPaginatedUsers
{
    public function execute(array $filters)
    {
        $query = User::with(['roles:id,name']);

        if ($filters['name']) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if ($filters['email']) {
            $query->where('email', 'like', "%{$filters['email']}%");
        }

        $users = $query
            ->orderBy("name", "ASC")
            ->paginate(perPage: 10, page: $filters['page']);

        return [
            'users' => $this->formatPagination($users),
            'filters' => $filters,
        ];
    }

    private function formatPagination($users): array
    {
        return PaginationHelper::format($users, UserResource::class);
    }


}