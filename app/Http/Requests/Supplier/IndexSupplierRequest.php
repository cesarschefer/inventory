<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class IndexSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:1,2,3'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return [
            'search' => $this->string('search')->toString(),
            'status' => $this->string('status', '3')->toString(),
            'tax_id' => $this->string('tax_id')->toString(),
            'page' => $this->integer('page', 1),
        ];
    }
}