<?php

namespace App\Http\Controllers;

use App\Actions\Product\GetPaginatedProducts;
use App\Http\Requests\Product\IndexProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class ProductController extends Controller
{

    public function __construct(
        private readonly GetPaginatedProducts $getPaginatedProducts
    ) {
    }

    /**
     * Display a paginated list of products
     */
    public function index(IndexProductRequest $request): Response
    {
        Gate::authorize('viewAny', Product::class);

        $result = $this->getPaginatedProducts->execute($request->filters());

        return Inertia::render('product/index', [
            'products' => $result['products'],
            'categories' => $result['categories'],
            'counts' => $result['counts'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);
        return redirect(route('products.index'));

    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('update', $product);

        $data = $request->validated();
        if ($request->hasFile('image') || ($request->exists('image') && $request->image === null)) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->hasFile('image')
                ? $request->file('image')->store('products', 'public')
                : null;
        } else {
            unset($data['image']);
        }
        $product->update($data);
        return redirect(route('products.index'));

    }

    /**
     * Remove the specified product.
     */
    public function destroy(string $id): RedirectResponse
    {
        $product = Product::findOrFail($id);

        Gate::authorize('delete', $product);

        $product->delete();
        return redirect(route('products.index'));
    }

    /**
     * Restore the specified product.
     */
    public function restore($id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);

        Gate::authorize('restore', $product);

        $product->restore();
        return redirect(route('products.index'));
    }
}
