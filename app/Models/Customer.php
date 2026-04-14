<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'tax_id',
        'email',
        'phone',
        'state',
        'city',
        'address',
        'floor',
        'apartment',
        'customer_type',
        'created_by'
    ];

    protected $dates = ['deleted_at'];

    public function saleInvoices(): HasMany
    {
        return $this->hasMany(SaleInvoice::class);
    }

}
