<?php

namespace App\Reports;

use App\Exports\ProfitExport;
use App\Models\PurchaseInvoice;
use App\Models\SaleInvoice;
use App\Reports\Contracts\ReportGenerator;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class ProfitReport implements ReportGenerator
{
    public function generate(string $format, Carbon $from, Carbon $to): Response
    {
        if ($format === 'excel') {
            return Excel::download(new ProfitExport($from, $to), 'profit.xlsx');
        }

        $salesTotal = SaleInvoice::whereBetween('invoice_date', [$from, $to])->sum('total');
        $purchasesTotal = PurchaseInvoice::whereBetween('invoice_date', [$from, $to])->sum('total');
        $data = [
            'salesTotal' => $salesTotal,
            'purchasesTotal' => $purchasesTotal,
            'profit' => $salesTotal - $purchasesTotal,
        ];

        $pdf = Pdf::loadView('reports.profit', [
            'title' => 'Profit Report',
            'data' => $data,
            'from' => $from,
            'to' => $to,
        ]);

        return $pdf->download('profit.pdf');
    }
}
