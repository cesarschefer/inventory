<?php

namespace App\Http\Controllers;

use App\Http\Requests\Supplier\IndexSupplierRequest;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Actions\Supplier\GetPaginatedSuppliers;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class SupplierController extends Controller
{

    public function __construct(
        private readonly GetPaginatedSuppliers $getPaginatedSuppliers
    ) {
    }

    /**
     * Display a paginated list of suppliers.
     */
    public function index(IndexSupplierRequest $request): Response
    {
        Gate::authorize('viewAny', Supplier::class);

        $result = $this->getPaginatedSuppliers->execute($request->filters());

        return Inertia::render('supplier/index', [
            'suppliers' => $result['suppliers'],
            'counts' => $result['counts'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Store a newly created supplier.
     */
    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        Gate::authorize('create', Supplier::class);

        Supplier::create(array_merge(
            $request->validated(),
            ['created_by' => auth()->user()->id]
        ));

        return redirect(route('suppliers.index'));
    }

    /**
     * Update the specified supplier.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        Gate::authorize('update', $supplier);

        $supplier->update($request->validated());
        return redirect(route('suppliers.index'));
    }

    /**
     * Remove the specified supplier.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        Gate::authorize('delete', $supplier);

        $supplier->delete();
        return redirect(route('suppliers.index'));
    }

    /**
     * Restore the specified supplier from deleted.
     */
    public function restore($id): RedirectResponse
    {
        $supplier = Supplier::withTrashed()->findOrFail($id);

        Gate::authorize('restore', $supplier);

        $supplier->restore();
        return redirect(route('suppliers.index'));
    }
}
