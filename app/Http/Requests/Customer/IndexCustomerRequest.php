<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class IndexCustomerRequest extends FormRequest
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
            'customer_type' => ['nullable', 'in:1,2,3'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return [
            'search' => $this->string('search')->toString(),
            'status' => $this->string('status', '3')->toString(),
            'customer_type' => $this->string('customer_type', '3')->toString(),
            'tax_id' => $this->string('tax_id')->toString(),
            'page' => $this->integer('page', 1),
        ];
    }
}