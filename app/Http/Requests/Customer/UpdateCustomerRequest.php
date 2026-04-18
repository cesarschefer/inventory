<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
        $customerId = $this->route('customer')->id ?? null;

        return [
            'name' => 'required|string|max:100',
            'tax_id' => 'nullable|required_if:customer_type,2|string|max:30|unique:customers,tax_id,' . $customerId,
            'email' => [
                'required',
                'email',
                Rule::unique('customers', 'email')->ignore($customerId),
            ],
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
}
