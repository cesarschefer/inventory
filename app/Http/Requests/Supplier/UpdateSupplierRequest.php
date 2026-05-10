<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $supplierId = $this->route('supplier')->id ?? null;
        return [
            'name' => 'required|string|max:100',
            'tax_id' => 'required|string|max:30|unique:suppliers,tax_id,' . $supplierId,
            'email' => [
                'required',
                'email',
                Rule::unique('suppliers', 'email')->ignore($supplierId),
            ],
            'phone' => 'nullable|string|max:30',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Supplier name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'This email is already taken.',
            'tax_id.required' => 'Tax ID is required.',
            'tax_id.unique' => 'This Tax ID is already taken.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'tax_id' => $this->tax_id ?? $this->taxId ?? null,
        ]);
    }
}
