<?php

namespace App\Http\Requests\SaleInvoice;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleInvoiceRequest extends FormRequest
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
            'customer_id' => 'required|exists:customers,id',
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                'unique:sale_invoices,invoice_number',
            ],
            'invoice_date' => 'required|date',
            'total' => 'required|numeric|min:0',
            'invoiceItems' => 'required|array|min:1',
            'invoiceItems.*.product_id' => 'required|exists:products,id',
            'invoiceItems.*.quantity' => 'required|numeric|min:1',
            'invoiceItems.*.unit_price' => 'required|numeric|gt:0',
            'invoiceItems.*.subtotal' => 'required|numeric|gt:0',
            'invoiceItems.*.discount_type' => 'required|in:0,1',
            'invoiceItems.*.discount' => 'required|numeric|min:0',
            'invoiceItems.*.total' => 'required|numeric|gt:0',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer is required.',
            'customer_id.exists' => 'Selected customer does not exist.',
            'invoice_number.required' => 'Invoice number is required.',
            'invoice_number.unique' => 'Invoice number already exists.',
            'invoice_date.required' => 'Invoice date is required.',
            'total.required' => 'Invoice total is required.',
            'total.gt' => 'Invoice total must be greater than 0.',
            'invoiceItems.required' => 'At least one invoice item is required.',
            'invoiceItems.array' => 'Invoice items must be an array.',
            'invoiceItems.min' => 'At least one invoice item is required.',
            'invoiceItems.*.product_id.required' => 'Product is required for each line.',
            'invoiceItems.*.product_id.exists' => 'Selected product does not exist.',
            'invoiceItems.*.quantity.required' => 'Quantity is required.',
            'invoiceItems.*.quantity.min' => 'Quantity must be at least 1.',
            'invoiceItems.*.unit_price.required' => 'Unit price is required.',
            'invoiceItems.*.unit_price.gt' => 'Unit price must be greater than 0.',
            'invoiceItems.*.subtotal.required' => 'Subtotal is required.',
            'invoiceItems.*.subtotal.gt' => 'Subtotal must be greater than 0.',
            'invoiceItems.*.discount_type.required' => 'Discount Type is required.',
            'invoiceItems.*.discount.required' => 'Discount is required.',
            'invoiceItems.*.discount.min' => 'Discount must be at least 0.',
            'invoiceItems.*.total.required' => 'Total is required.',
            'invoiceItems.*.total.gt' => 'Total must be greater than 0.',
        ];
    }
}
