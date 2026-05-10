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
            'customer_type' => 'required|integer|in:1,2',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:customers,email',
            'tax_id' => 'nullable|required_if:customer_type,2|string|max:30|unique:customers,tax_id',
            'phone' => 'nullable|string|max:30',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:10',
            'apartment' => 'nullable|string|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_type.required' => 'Customer type is required.',
            'customer_type.integer' => 'Customer type must be an integer.',
            'customer_type.in' => 'Customer type must be 1 or 2.',
            'name.required' => 'Customer name is required.',
            'name.string' => 'Customer name must be a string.',
            'name.max' => 'Customer name cannot be longer than 100 characters.',
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
