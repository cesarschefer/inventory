<?php

namespace App\Reports;

use App\Reports\Contracts\ReportGenerator;
use Carbon\Carbon;
use App\Exports\PurchasesExport;
use App\Models\PurchaseInvoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;

class PurchasesReport implements ReportGenerator
{

    public function generate(string $format, Carbon $from, Carbon $to): Response
    {
        if ($format === 'excel') {
            return Excel::download(new PurchasesExport($from, $to), 'purchases.xlsx');
        }

        $invoices = PurchaseInvoice::with('supplier')
            ->whereBetween('invoice_date', [$from, $to])
            ->orderBy('invoice_date')
            ->get();

        $pdf = Pdf::loadView('reports.purchases', [
            'title' => 'Purchases Report',
            'invoices' => $invoices,
            'from' => $from,
            'to' => $to,
        ]);

        return $pdf->download('purchases_report.pdf');
    }
}
