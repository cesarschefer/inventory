<?php

namespace Tests\Unit\Reports;

use App\Reports\ProfitReport;
use App\Reports\PurchasesReport;
use App\Reports\ReportFactory;
use App\Reports\SalesReport;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;

#[Group('valid')]
#[Group('report')]
class ReportFactoryTest extends TestCase
{
    public function test_creates_purchases_report(): void
    {
        $report = ReportFactory::make('purchases');

        $this->assertInstanceOf(PurchasesReport::class, $report);
    }

    public function test_creates_sales_report(): void
    {
        $report = ReportFactory::make('sales');

        $this->assertInstanceOf(SalesReport::class, $report);
    }

    public function test_creates_profit_report(): void
    {
        $report = ReportFactory::make('profit');

        $this->assertInstanceOf(ProfitReport::class, $report);
    }

    public function test_throws_exception_for_invalid_report_type(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid report type: invalid');

        ReportFactory::make('invalid');
    }
}
