<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleInvoice\StoreSaleInvoiceRequest;
use App\Http\Requests\SaleInvoice\UpdateSaleInvoiceRequest;
use App\Http\Requests\SaleInvoice\IndexSaleInvoiceRequest;
use App\Http\Resources\SaleInvoice\SaleInvoiceResource;
use App\Models\SaleInvoice;
use App\Models\Customer;
use App\Models\Product;
use App\Enums\InvoiceStatus;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use App\Actions\SaleInvoice\GetPaginatedSaleInvoices;
use App\Services\SaleInvoice\SaleInvoiceService;

class SaleInvoiceController extends Controller
{
    public function __construct(
        private readonly GetPaginatedSaleInvoices $getPaginatedSaleInvoices,
        private readonly SaleInvoiceService $saleInvoiceService
    ) {
    }

    /**
     * Display a paginated list of sale invoices
     */
    public function index(IndexSaleInvoiceRequest $request): Response
    {
        Gate::authorize('viewAny', SaleInvoice::class);

        $result = $this->getPaginatedSaleInvoices->execute($request->filters());

        return Inertia::render('sale-invoice/index', [
            'saleInvoices' => $result['saleInvoices'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Show the form for creating a new sale invoice.
     */
    public function create(): Response
    {
        Gate::authorize('create', SaleInvoice::class);

        return Inertia::render('sale-invoice/create', [
            'customers' => Customer::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created sale invoice.
     */
    public function store(StoreSaleInvoiceRequest $request): RedirectResponse
    {
        Gate::authorize('create', SaleInvoice::class);

        $this->saleInvoiceService->create([
            'customer_id' => $request->customer_id,
            'invoice_number' => $request->invoice_number,
            'invoice_date' => $request->invoice_date,
            'total' => $request->total,
            'items' => $request->invoiceItems,
        ]);

        return redirect(route('sale-invoices.index'));
    }

    /**
     * Display the specified sale invoice.
     */
    public function show(SaleInvoice $saleInvoice): Response
    {
        Gate::authorize('view', $saleInvoice);

        return Inertia::render('sale-invoice/show', [
            'sale_invoice' => SaleInvoiceResource::make($saleInvoice->load('items.product'))->resolve(),
            'customers' => Customer::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified sale invoice.
     */
    public function update(UpdateSaleInvoiceRequest $request, SaleInvoice $saleInvoice): RedirectResponse
    {
        Gate::authorize('update', $saleInvoice);

        $this->saleInvoiceService->update($saleInvoice, [
            'customer_id' => $request->customer_id,
            'invoice_number' => $request->invoice_number,
            'invoice_date' => $request->invoice_date,
            'total' => $request->total,
            'items' => $request->invoiceItems,
        ]);
        return redirect(route('sale-invoices.index'));
    }

    /**
     * Remove the specified sale invoice.
     */
    public function destroy(SaleInvoice $saleInvoice): RedirectResponse
    {
        Gate::authorize('delete', $saleInvoice);

        if ($saleInvoice->status !== InvoiceStatus::CREATED->value) {
            return back()->withErrors([
                'message' => 'Only invoices in CREATED status can be cancelled.'
            ]);
        }

        $saleInvoice->status = InvoiceStatus::CANCELLED;
        $saleInvoice->stockMovements()->delete();
        $saleInvoice->save();

        return redirect(route('sale-invoices.index'));
    }

    /**
     * Confirm the specified sale invoice.
     */
    public function confirm(SaleInvoice $saleInvoice): RedirectResponse
    {
        Gate::authorize('update', $saleInvoice);

        if ($saleInvoice->status !== InvoiceStatus::CREATED->value) {
            return back()->withErrors([
                'message' => 'Only invoices in CREATED status can be confirmed.'
            ]);
        }

        $saleInvoice->status = InvoiceStatus::CONFIRMED;
        $saleInvoice->save();

        return redirect(route('sale-invoices.index'));
    }
}
