<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:100',
            'tax_id' => 'required|string|max:30|unique:suppliers,tax_id',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:30',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:10',
            'apartment' => 'nullable|string|max:10',
            'customer_type' => 'required|integer|in:1,2',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Supplier name is required.',
            'name.string' => 'Supplier name must be a string.',
            'name.max' => 'Supplier name cannot be longer than 100 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'This email is already taken.',
            'tax_id.required_if' => 'Tax ID is required for companies.',
            'phone.max' => 'Phone number cannot be longer than 30 characters.',
            'state.max' => 'State cannot be longer than 100 characters.',
            'city.max' => 'City cannot be longer than 100 characters.',
            'address.max' => 'Address cannot be longer than 100 characters.',
        ];
    }

    /**
     * Normalize frontend fields to correct DB names
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'tax_id' => $this->tax_id ?? $this->taxId ?? null,
            'customer_type' => $this->customer_type ?? $this->customerType ?? 1,
        ]);
    }

}
