<?php

namespace App\Policies;

use App\Models\PurchaseInvoice;
use App\Models\User;

class PurchaseInvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view-purchases');
    }

    public function view(User $user, PurchaseInvoice $purchaseInvoice): bool
    {
        return $user->can('view-purchases');
    }

    public function create(User $user): bool
    {
        return $user->can('create-purchases');
    }

    public function update(User $user, PurchaseInvoice $purchaseInvoice): bool
    {
        return $user->can('edit-purchases');
    }

    public function delete(User $user, PurchaseInvoice $purchaseInvoice): bool
    {
        return $user->can('delete-purchases');
    }
}
