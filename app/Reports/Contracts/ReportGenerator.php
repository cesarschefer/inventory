<?php

namespace App\Reports\Contracts;

use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

interface ReportGenerator
{
    public function generate(string $format, Carbon $from, Carbon $to): Response;
}
