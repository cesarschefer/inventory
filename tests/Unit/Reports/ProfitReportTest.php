<?php

namespace Tests\Unit\Reports;

use App\Reports\Contracts\ReportGenerator;
use App\Reports\ProfitReport;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfitReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_is_instance_of_report_generator(): void
    {
        $report = new ProfitReport();

        $this->assertInstanceOf(ReportGenerator::class, $report);
    }

    public function test_generates_pdf_download(): void
    {
        $report = new ProfitReport();
        $from = Carbon::parse('2024-01-01');
        $to = Carbon::parse('2024-01-31');

        $response = $report->generate('pdf', $from, $to);

        $this->assertInstanceOf(\Symfony\Component\HttpFoundation\Response::class, $response);
    }
}
