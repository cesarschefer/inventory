<?php

namespace App\Policies;

use App\Models\SaleInvoice;
use App\Models\User;

class SaleInvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view-sales');
    }

    public function view(User $user, SaleInvoice $saleInvoice): bool
    {
        return $user->can('view-sales');
    }

    public function create(User $user): bool
    {
        return $user->can('create-sales');
    }

    public function update(User $user, SaleInvoice $saleInvoice): bool
    {
        return $user->can('edit-sales');
    }

    public function delete(User $user, SaleInvoice $saleInvoice): bool
    {
        return $user->can('delete-sales');
    }
}
