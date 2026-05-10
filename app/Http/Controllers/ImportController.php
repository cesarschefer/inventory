<?php

namespace App\Http\Controllers;

use App\Imports\ImportFactory;
use App\Http\Requests\Import\ImportRequest;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('import/index');
    }

    public function import(ImportRequest $request): JsonResponse
    {
        $type = $request->input('import_type');

        try {
            $handler = ImportFactory::make($type);
            return $handler->import($request->file('file'));
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}