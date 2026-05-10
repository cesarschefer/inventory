<?php

namespace Tests\Unit\Imports;

use App\Imports\ImportFactory;
use App\Imports\ProductsImport;
use App\Imports\CategoriesImport;
use App\Imports\SuppliersImport;
use App\Imports\CustomersImport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('import')]
class ImportFactoryTest extends TestCase
{
    use RefreshDatabase;
    public function test_make_returns_products_import_handler(): void
    {
        $handler = ImportFactory::make('products');
        $this->assertInstanceOf(ProductsImport::class, $handler);
    }

    public function test_make_returns_categories_import_handler(): void
    {
        $handler = ImportFactory::make('categories');
        $this->assertInstanceOf(CategoriesImport::class, $handler);
    }

    public function test_make_returns_suppliers_import_handler(): void
    {
        $handler = ImportFactory::make('suppliers');
        $this->assertInstanceOf(SuppliersImport::class, $handler);
    }

    public function test_make_returns_customers_import_handler(): void
    {
        $handler = ImportFactory::make('customers');
        $this->assertInstanceOf(CustomersImport::class, $handler);
    }

    public function test_make_throws_exception_for_invalid_type(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid import type: invalid_type');
        ImportFactory::make('invalid_type');
    }
}