<?php

namespace App\Http\Requests\SaleInvoice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSaleInvoiceRequest extends FormRequest
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
        $invoiceId = $this->route('sale_invoice');
        return [
            'customer_id' => 'required|exists:customers,id',
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sale_invoices', 'invoice_number')->ignore($invoiceId),
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

    public function messages()
    {
        return (new StoreSaleInvoiceRequest())->messages();
    }
}
