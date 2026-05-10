<?php

namespace App\Http\Controllers;

use App\Http\Requests\Report\GenerateReportRequest;
use App\Reports\ReportFactory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('report/index', [
            'filters' => [
                'report_type' => 'purchases',
                'date_from' => Carbon::now()->startOfMonth()->toDateString(),
                'date_to' => Carbon::now()->endOfMonth()->toDateString(),
            ],
        ]);
    }

    public function export(GenerateReportRequest $request)
    {
        $format = $request->input('format', 'excel');
        $from = $request->date_from
            ? Carbon::parse($request->date_from)->startOfDay()
            : Carbon::now()->startOfMonth();

        $to = $request->date_to
            ? Carbon::parse($request->date_to)->endOfDay()
            : Carbon::now()->endOfMonth();
        $reportType = $request->input('report_type', 'purchases');

        try {
            return ReportFactory::make($reportType)->generate($format, $from, $to);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

}
