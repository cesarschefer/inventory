<?php

namespace App\Reports;

use App\Exports\SalesExport;
use App\Models\SaleInvoice;
use App\Reports\Contracts\ReportGenerator;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class SalesReport implements ReportGenerator
{
    public function generate(string $format, Carbon $from, Carbon $to): Response
    {
        if ($format === 'excel') {
            return Excel::download(new SalesExport($from, $to), 'sales.xlsx');
        }

        $invoices = SaleInvoice::with('customer')
            ->whereBetween('invoice_date', [$from, $to])
            ->orderBy('invoice_date')
            ->get();

        $pdf = Pdf::loadView('reports.sales', [
            'title' => 'Sales Report',
            'invoices' => $invoices,
            'from' => $from,
            'to' => $to,
        ]);

        return $pdf->download('sales_report.pdf');
    }
}
