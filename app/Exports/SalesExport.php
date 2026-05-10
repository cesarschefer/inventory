<?php

namespace App\Exports;

use App\Models\SaleInvoice;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SalesExport implements FromCollection, WithHeadings
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
        return SaleInvoice::with(['customer:id,name'])
            ->select(['id', 'invoice_date', 'invoice_number', 'customer_id', 'total'])
            ->whereBetween('invoice_date', [$this->from, $this->to])
            ->orderBy('invoice_date')
            ->get()
            ->map(function ($invoice) {
                return [
                    'ID' => $invoice->id,
                    'Invoice Date' => Carbon::parse($invoice->invoice_date)->format('d-m-Y'),
                    'Customer' => $invoice->customer->name,
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
            'Customer',
            'Invoice Number',
            'Total',
        ];
    }
}
