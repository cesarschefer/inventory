<?php

namespace App\Http\Requests\PurchaseInvoice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseInvoiceRequest extends FormRequest
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
            'supplier_id' => 'required|exists:suppliers,id',
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('purchase_invoices')->where(fn($query) => $query->where('supplier_id', $this->supplier_id)),
            ],
            'invoice_date' => 'required|date',
            'total' => 'required|numeric|gt:0',
            'invoiceItems' => 'required|array|min:1',
            'invoiceItems.*.product_id' => 'required|exists:products,id',
            'invoiceItems.*.quantity' => 'required|numeric|min:1',
            'invoiceItems.*.unit_price' => 'required|numeric|gt:0',
            'invoiceItems.*.subtotal' => 'required|numeric|gt:0',
        ];
    }

    public function messages()
    {
        return [
            'supplier_id.required' => 'Supplier is required.',
            'supplier_id.exists' => 'Selected supplier does not exist.',
            'invoice_number.required' => 'Invoice number is required.',
            'invoice_number.unique' => 'This supplier already has an invoice with this number.',
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
        ];
    }
}
