<?php

namespace App\Exports;

use App\Models\PurchaseInvoice;
use App\Models\SaleInvoice;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProfitExport implements FromCollection, WithHeadings
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
        $salesTotal = SaleInvoice::whereBetween('invoice_date', [$this->from, $this->to])
            ->sum('total');

        $purchasesTotal = PurchaseInvoice::whereBetween('invoice_date', [$this->from, $this->to])
            ->sum('total');

        $profit = $salesTotal - $purchasesTotal;

        return collect([
            ['Sales', $salesTotal],
            ['Purchases', $purchasesTotal],
            ['Profit', $profit],
        ]);
    }

    public function headings(): array
    {
        return [
            'Concept',
            'Amount',
        ];
    }
}
