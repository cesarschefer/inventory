<?php

namespace App\Imports;

use App\Imports\Contracts\ImportHandler;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Validators\Failure;

class ProductsImport implements OnEachRow, WithHeadingRow, WithValidation, SkipsOnFailure, ImportHandler
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
        $rowIndex = $row->getRowIndex();
        $rowData = $row->toArray();

        $category = Category::whereRaw(
            'LOWER(name) = ?',
            [strtolower($rowData['category'] ?? '')]
        )->first();

        if (!$category) {
            $this->skippedRows[] = [
                'row' => $rowIndex,
                'errors' => ["Category '{$rowData['category']}' not found"],
            ];
            return null;
        }

        Product::create([
            'name' => $rowData['name'],
            'sku' => $rowData['sku'],
            'detail' => $rowData['detail'] ?? '',
            'category_id' => $category->id,
        ]);

        $this->importedCount++;
    }

    public function rules(): array
    {
        return [
            '*.category' => 'required|string|exists:categories,name',
            '*.name' => 'required|string|max:255',
            '*.sku' => 'required|string|max:255|unique:products',
            '*.detail' => 'nullable|string',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'category.required' => 'Category is required.',
            'category.exists' => 'Selected category does not exist.',
            'name.required' => 'Product name is required.',
            'sku.required' => 'Product SKU is required.',
            'sku.unique' => 'Product SKU already exists.',
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