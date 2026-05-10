<?php

namespace App\Reports;
use App\Reports\Contracts\ReportGenerator;
use InvalidArgumentException;

class ReportFactory
{
    public static function make(string $type): ReportGenerator
    {
        return match ($type) {
            'purchases' => new PurchasesReport(),
            'sales' => new SalesReport(),
            'profit' => new ProfitReport(),
            default => throw new InvalidArgumentException("Invalid report type: {$type}")
        };
    }
}
