<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\PurchaseInvoice;
use App\Models\SaleInvoice;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        return Inertia::render('dashboard', [
            'customers' => Customer::count(),
            'suppliers' => Supplier::count(),
            'products' => Product::count(),
            'users' => User::count(),
            'categories' => Category::count(),
            'purchase_invoices' => PurchaseInvoice::count(),
            'sale_invoices' => SaleInvoice::count()
        ]);
    }
}