<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        $query = Product::query()->with('category');

        if (!empty($this->filters['name'])) {
            $query->where('name', 'like', '%' . $this->filters['name'] . '%');
        }

        if (!empty($this->filters['sku'])) {
            $query->where('sku', 'like', '%' . $this->filters['sku'] . '%');
        }

        if (!empty($this->filters['category'])) {
            $query->where('category_id', $this->filters['category']);
        }

        if (!empty($this->filters['active'])) {
            if ($this->filters['active'] == 1) {
                $query->whereNull('deleted_at'); // active
            } elseif ($this->filters['active'] == 2) {
                $query->whereNotNull('deleted_at'); // inactive
            }
        }

        return $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category->name ?? '-',
                'created' => $product->created_at->format('Y-m-d'),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'SKU',
            'Category',
            'Created At',
        ];
    }
}
