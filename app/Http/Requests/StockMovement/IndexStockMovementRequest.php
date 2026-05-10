<?php

namespace App\Http\Requests\StockMovement;

use Illuminate\Foundation\Http\FormRequest;

class IndexStockMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'productId' => ['nullable', 'string'],
            'dateFrom' => ['nullable', 'date'],
            'dateTo' => ['nullable', 'date', 'after_or_equal:dateFrom'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return [
            'productId' => $this->string('productId', 'all')->toString() ?: 'all',
            'dateFrom' => $this->string('dateFrom')->toString(),
            'dateTo' => $this->string('dateTo')->toString(),
            'page' => $this->integer('page', 1),
        ];
    }
}