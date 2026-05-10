<?php

namespace App\Imports;

use App\Models\Category;
use App\Imports\Contracts\ImportHandler;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;

class CategoriesImport implements OnEachRow, WithHeadingRow, WithValidation, SkipsOnFailure, ImportHandler
{
    use SkipsFailures;

    public array $skippedRows = [];
    private int $importedCount = 0;

    public function import(UploadedFile $file): JsonResponse
    {
        Excel::import($this, $file);

        return response()->json([
            'imported' => $this->importedCount,
            'skipped' => count($this->skippedRows),
            'errors' => $this->skippedRows,
        ]);
    }

    public function onRow(Row $row)
    {
        $rowData = $row->toArray();

        Category::create([
            'name' => $rowData['name'],
        ]);
        $this->importedCount++;
    }

    public function rules(): array
    {
        return [
            '*.name' => 'required|string|max:255|unique:categories,name',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'name.required' => 'The category name is required.',
            'name.unique' => 'The category name already exists.',
        ];
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->skippedRows[] = [
                'row' => $failure->row(),
                'errors' => $failure->errors(),
            ];
        }
    }
}

