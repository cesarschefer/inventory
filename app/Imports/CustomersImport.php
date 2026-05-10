<?php

namespace App\Imports;

use App\Models\Customer;
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

class CustomersImport implements OnEachRow, WithHeadingRow, WithValidation, SkipsOnFailure, ImportHandler
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

        Customer::create([
            'name' => (string) ($rowData['name'] ?? ''),
            'email' => (string) ($rowData['email'] ?? ''),
            'customer_type' => (int) ($rowData['customer_type'] ?? 1),
            'tax_id' => (string) ($rowData['tax_id'] ?? ''),
            'phone' => (string) ($rowData['phone'] ?? ''),
            'state' => (string) ($rowData['state'] ?? ''),
            'city' => (string) ($rowData['city'] ?? ''),
            'address' => (string) ($rowData['address'] ?? ''),
            'floor' => (string) ($rowData['floor'] ?? ''),
            'apartment' => (string) ($rowData['apartment'] ?? ''),
            'created_by' => 1,
        ]);
        $this->importedCount++;
    }

    public function rules(): array
    {
        return [
            '*.customer_type' => 'required|integer|in:1,2',
            '*.name' => 'required|string|max:100',
            '*.email' => 'required|email|unique:customers,email',
            '*.tax_id' => 'nullable|required_if:customer_type,2|max:30|unique:customers,tax_id',
            '*.phone' => 'nullable|max:30',
            '*.state' => 'nullable|max:100',
            '*.city' => 'nullable|max:100',
            '*.address' => 'nullable|max:100',
            '*.floor' => 'nullable|max:10',
            '*.apartment' => 'nullable|max:10',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            '*.customer_type.required' => 'Customer type is required.',
            '*.customer_type.integer' => 'Customer type must be an integer.',
            '*.customer_type.in' => 'Customer type must be 1 or 2.',
            '*.name.required' => 'Customer name is required.',
            '*.name.string' => 'Customer name must be a string.',
            '*.name.max' => 'Customer name cannot be longer than 100 characters.',
            '*.email.required' => 'Email is required.',
            '*.email.email' => 'Email must be a valid email address.',
            '*.email.unique' => 'This email is already taken.',
            '*.tax_id.required_if' => 'Tax ID is required for companies.',
            '*.phone.max' => 'Phone number cannot be longer than 30 characters.',
            '*.state.max' => 'State cannot be longer than 100 characters.',
            '*.city.max' => 'City cannot be longer than 100 characters.',
            '*.address.max' => 'Address cannot be longer than 100 characters.',
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

