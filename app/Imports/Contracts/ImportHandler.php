<?php

namespace App\Imports\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;

interface ImportHandler
{
    public function import(UploadedFile $file): JsonResponse;
}