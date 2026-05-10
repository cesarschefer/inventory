<?php

namespace App\Http\Requests\PurchaseInvoice;

use Illuminate\Foundation\Http\FormRequest;

class IndexPurchaseInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:all,0,1,2'],
            'dateFrom' => ['nullable', 'date'],
            'dateTo' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return [
            'number' => $this->string('number')->toString(),
            'status' => $this->string('status', 'all')->toString(),
            'dateFrom' => $this->string('dateFrom')->toString(),
            'dateTo' => $this->string('dateTo')->toString(),
            'page' => $this->integer('page', 1),
        ];
    }
}