<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SaleInvoiceController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::post('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    Route::resource('customers', CustomerController::class)->except(['show']);
    Route::post('customers/{id}/restore', [CustomerController::class, 'restore'])->name('customers.restore');

    Route::resource('suppliers', SupplierController::class)->except(['show']);
    Route::post('suppliers/{id}/restore', [SupplierController::class, 'restore'])->name('suppliers.restore');

    Route::resource('products', ProductController::class)->except(['show']);
    Route::post('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');

    Route::resource('purchase-invoices', PurchaseInvoiceController::class);
    Route::put('purchase-invoices/{purchaseInvoice}/confirm', [PurchaseInvoiceController::class, 'confirm'])->name('purchase-invoices.confirm');

    Route::resource('sale-invoices', SaleInvoiceController::class);
    Route::put('sale-invoices/{saleInvoice}/confirm', [SaleInvoiceController::class, 'confirm'])->name('sale-invoices.confirm');

    Route::get('stock-movements', StockMovementController::class)
        ->name('stock-movements.index')
        ->middleware('can:view-stock-movements');

    Route::get('reports', [ReportController::class, 'index'])
        ->name('reports.index')
        ->middleware('can:view-reports');
    Route::get('reports/export', [ReportController::class, 'export'])
        ->name('reports.export')
        ->middleware('can:export-reports');

    Route::get('import', [ImportController::class, 'index'])
        ->name('import.index')
        ->middleware('can:import-data');
    Route::post('import', [ImportController::class, 'import'])
        ->name('import.import')
        ->middleware('can:import-data');

    Route::get('users', UserController::class)
        ->name('users.index')
        ->middleware('can:manage-users');
    Route::put('users/{user}/roles', UserRoleController::class)
        ->name('users.roles.update')
        ->middleware('can:manage-users');

    Route::get('roles', RoleController::class)
        ->name('roles.index')
        ->middleware('can:manage-roles');
    Route::put('roles/{role}/permissions', RolePermissionController::class)
        ->name('roles.permissions.update')
        ->middleware('can:manage-roles');
});

require __DIR__ . '/settings.php';
