<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleInvoiceItem extends Model
{
    public $table = 'sale_invoice_items';
    public $fillable = [
        'sale_invoice_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'discount_type',
        'discount',
        'total'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(SaleInvoice::class, 'sale_invoice_id');
    }
}
