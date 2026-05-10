<?php

namespace App\Http\Requests\PurchaseInvoice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePurchaseInvoiceRequest extends FormRequest
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
        $invoiceId = $this->route('purchase_invoice');

        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('purchase_invoices')
                    ->where(fn($query) => $query->where('supplier_id', $this->supplier_id))
                    ->ignore($invoiceId),
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
        return (new StorePurchaseInvoiceRequest())->messages();
    }
}
