<?php

namespace App\Exports;

use App\Models\PurchaseInvoice;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PurchasesExport implements FromCollection, WithHeadings
{
    protected $from;
    protected $to;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        return PurchaseInvoice::with(['supplier:id,name'])
            ->select(['id', 'invoice_date', 'invoice_number', 'supplier_id', 'total'])
            ->whereBetween('invoice_date', [$this->from, $this->to])
            ->orderBy('invoice_date')
            ->get()
            ->map(function ($invoice) {
                return [
                    'ID' => $invoice->id,
                    'Invoice Date' => Carbon::parse($invoice->invoice_date)->format('d-m-Y'),
                    'Supplier' => $invoice->supplier->name,
                    'Invoice Number' => $invoice->invoice_number,
                    'Total' => $invoice->total,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Invoice Date',
            'Supplier',
            'Invoice Number',
            'Total',
        ];
    }
}
