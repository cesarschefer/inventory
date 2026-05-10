<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class IndexProductRequest extends FormRequest
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
            'category_id' => ['nullable'],
            'sku' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return [
            'search' => $this->string('search')->toString(),
            'status' => $this->string('status', '3')->toString(),
            'category_id' => $this->string('category_id', 'all')->toString() ?: 'all',
            'sku' => $this->string('sku')->toString(),
            'page' => $this->integer('page', 1),
        ];
    }
}