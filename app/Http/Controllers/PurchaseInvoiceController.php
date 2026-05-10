<?php

namespace App\Http\Controllers;

use App\Actions\PurchaseInvoice\GetPaginatedPurchaseInvoices;
use App\Services\PurchaseInvoice\PurchaseInvoiceService;
use App\Http\Requests\PurchaseInvoice\StorePurchaseInvoiceRequest;
use App\Http\Requests\PurchaseInvoice\UpdatePurchaseInvoiceRequest;
use App\Http\Requests\PurchaseInvoice\IndexPurchaseInvoiceRequest;
use App\Http\Resources\PurchaseInvoice\PurchaseInvoiceResource;
use App\Models\PurchaseInvoice;
use App\Models\Supplier;
use App\Models\Product;
use App\Enums\InvoiceStatus;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class PurchaseInvoiceController extends Controller
{
    public function __construct(
        private readonly GetPaginatedPurchaseInvoices $getPaginatedPurchaseInvoices,
        private readonly PurchaseInvoiceService $purchaseInvoiceService,
    ) {
    }
    /**
     * Display a paginated list of purchase invoices
     */
    public function index(IndexPurchaseInvoiceRequest $request): Response
    {
        Gate::authorize('viewAny', PurchaseInvoice::class);

        $result = $this->getPaginatedPurchaseInvoices->execute($request->filters());

        return Inertia::render('purchase-invoice/index', [
            'purchaseInvoices' => $result['purchaseInvoices'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Show the form for creating a new purchase invoice.
     */
    public function create(): Response
    {
        Gate::authorize('create', PurchaseInvoice::class);

        return Inertia::render('purchase-invoice/create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created purchase invoice.
     */
    public function store(StorePurchaseInvoiceRequest $request): RedirectResponse
    {
        Gate::authorize('create', PurchaseInvoice::class);

        $this->purchaseInvoiceService->create([
            'supplier_id' => $request->supplier_id,
            'invoice_number' => $request->invoice_number,
            'invoice_date' => $request->invoice_date,
            'total' => $request->total,
            'items' => $request->invoiceItems,
        ]);

        return redirect(route('purchase-invoices.index'));
    }

    /**
     * Display the specified purchase invoice.
     */
    public function show(PurchaseInvoice $purchaseInvoice): Response
    {
        Gate::authorize('view', $purchaseInvoice);

        return Inertia::render('purchase-invoice/show', [
            'purchase_invoice' => PurchaseInvoiceResource::make($purchaseInvoice->load('items.product'))->resolve(),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified purchase invoice.
     */
    public function update(UpdatePurchaseInvoiceRequest $request, PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        Gate::authorize('update', $purchaseInvoice);

        $this->purchaseInvoiceService->update($purchaseInvoice, [
            'supplier_id' => $request->supplier_id,
            'invoice_number' => $request->invoice_number,
            'invoice_date' => $request->invoice_date,
            'total' => $request->total,
            'items' => $request->invoiceItems,
        ]);

        return redirect(route('purchase-invoices.index'));
    }

    /**
     * Remove the specified purchase invoice.
     */
    public function destroy(PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        Gate::authorize('delete', $purchaseInvoice);

        if ($purchaseInvoice->status !== InvoiceStatus::CREATED->value) {
            return back()->withErrors([
                'message' => 'Only invoices in CREATED status can be cancelled.'
            ]);
        }

        $purchaseInvoice->status = InvoiceStatus::CANCELLED;
        $purchaseInvoice->stockMovements()->delete();
        $purchaseInvoice->save();

        return redirect(route('purchase-invoices.index'));
    }

    /**
     * Confirm the specified purchase invoice.
     */
    public function confirm(PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        Gate::authorize('update', $purchaseInvoice);

        if ($purchaseInvoice->status !== InvoiceStatus::CREATED->value) {
            return back()->withErrors([
                'message' => 'Only invoices in CREATED status can be confirmed.'
            ]);
        }

        $purchaseInvoice->status = InvoiceStatus::CONFIRMED;
        $purchaseInvoice->save();

        return redirect(route('purchase-invoices.index'));
    }
}
