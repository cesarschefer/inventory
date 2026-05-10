<?php

namespace App\Imports;

use App\Imports\Contracts\ImportHandler;
use InvalidArgumentException;
use App\Imports\ProductsImport;
use App\Imports\CategoriesImport;
use App\Imports\SuppliersImport;
use App\Imports\CustomersImport;

class ImportFactory
{
    public static function make(string $type): ImportHandler
    {
        return match ($type) {
            'products' => new ProductsImport(),
            'categories' => new CategoriesImport(),
            'suppliers' => new SuppliersImport(),
            'customers' => new CustomersImport(),
            default => throw new InvalidArgumentException("Invalid import type: {$type}")
        };
    }
}