<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\Customer\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $search = request('search', '');
        $status = request('status', '3');
        $customer_type = request('customer_type', '3');
        $tax_id = request('tax_id', '');
        $page = request('page', 1);

        $query = Customer::withTrashed();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($tax_id) {
            $query->where('tax_id', 'like', "{$tax_id}%");
        }

        if ($status === '1') {
            $query->whereNull('deleted_at');
        } elseif ($status === '2') {
            $query->whereNotNull('deleted_at');
        }

        if ($customer_type === '1') {
            $query->where('customer_type', 1);
        } elseif ($customer_type === '2') {
            $query->where('customer_type', 2);
        }

        $customers = $query->orderBy("name", "ASC")->paginate(
            perPage: 10,
            page: $page
        );

        $activeCount = Customer::count();
        $inactiveCount = Customer::onlyTrashed()->count();

        return Inertia::render('customer/index', [
            'customers' => [
                'data' => CustomerResource::collection($customers)->resolve(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
                'from' => $customers->firstItem(),
                'to' => $customers->lastItem(),
                'next_page_url' => $customers->nextPageUrl(),
                'prev_page_url' => $customers->previousPageUrl(),
            ],
            'counts' => [
                'active' => $activeCount,
                'inactive' => $inactiveCount,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'customer_type' => $customer_type,
                'tax_id' => $tax_id,
            ],
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
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
        $customer->update($request->validated());
        return redirect(route('customers.index'));
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();
        return redirect(route('customers.index'));
    }

    /**
     * Restore the specified customer.
     */
    public function restore($id): RedirectResponse
    {
        $customer = Customer::withTrashed()->findOrFail($id);
        $customer->restore();
        return redirect(route('customers.index'));
    }
}
