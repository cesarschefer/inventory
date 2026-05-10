<?php

namespace App\Imports;

use App\Models\Supplier;
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

class SuppliersImport implements OnEachRow, WithHeadingRow, WithValidation, SkipsOnFailure, ImportHandler
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

        Supplier::create([
            'name' => $rowData['name'],
            'tax_id' => (string) $rowData['tax_id'],
            'email' => (string) $rowData['email'],
            'phone' => (string) ($rowData['phone'] ?? ''),
            'state' => (string) ($rowData['state'] ?? ''),
            'city' => (string) ($rowData['city'] ?? ''),
            'address' => (string) ($rowData['address'] ?? ''),
            'created_by' => 1,
        ]);
        $this->importedCount++;
    }

    public function rules(): array
    {
        return [
            '*.name' => 'required|string|max:255',
            '*.tax_id' => 'required|max:100|unique:suppliers,tax_id',
            '*.email' => 'required|email|unique:suppliers,email',
            '*.phone' => 'nullable|max:30',
            '*.state' => 'nullable|max:100',
            '*.city' => 'nullable|max:100',
            '*.address' => 'nullable|max:100',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            '*.name.required' => 'The supplier name is required.',
            '*.tax_id.required' => 'The tax ID is required and must be unique.',
            '*.email.required' => 'The email is required and must be unique.',
            '*.email.email' => 'The email must be a valid email.',
        ];
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $row = $failure->row();
            if (!isset($this->skippedRows[$row])) {
                $this->skippedRows[$row] = [
                    'row' => $row,
                    'errors' => [],
                ];
            }
            $this->skippedRows[$row]['errors'] = array_merge(
                $this->skippedRows[$row]['errors'],
                $failure->errors()
            );
        }
        $this->skippedRows = array_values($this->skippedRows);
    }
}

