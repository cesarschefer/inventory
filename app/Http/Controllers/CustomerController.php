<?php

namespace App\Http\Controllers;

use App\Actions\Customer\GetPaginatedCustomers;
use App\Http\Requests\Customer\IndexCustomerRequest;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private readonly GetPaginatedCustomers $getPaginatedCustomers
    ) {
    }

    /**
     * Display a paginated list of customers.
     */
    public function index(IndexCustomerRequest $request): Response
    {
        Gate::authorize('viewAny', Customer::class);

        $result = $this->getPaginatedCustomers->execute($request->filters());

        return Inertia::render('customer/index', [
            'customers' => $result['customers'],
            'counts' => $result['counts'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        Gate::authorize('create', Customer::class);

        Customer::create(array_merge(
            $request->validated(),
            ['created_by' => auth()->user()->id]
        ));

        return redirect(route('customers.index'));
    }

    /**
     * Update the specified customer.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        Gate::authorize('update', $customer);

        $customer->update($request->validated());
        return redirect(route('customers.index'));
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        Gate::authorize('delete', $customer);

        $customer->delete();
        return redirect(route('customers.index'));
    }

    /**
     * Restore the specified customer.
     */
    public function restore($id): RedirectResponse
    {
        $customer = Customer::withTrashed()->findOrFail($id);

        Gate::authorize('restore', $customer);

        $customer->restore();
        return redirect(route('customers.index'));
    }
}
