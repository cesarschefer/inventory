<?php

namespace App\Http\Controllers;

use App\Actions\Category\GetPaginatedCategories;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Category\IndexCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class CategoryController extends Controller
{

    public function __construct(
        private readonly GetPaginatedCategories $getPaginatedCategories
    ) {
    }

    /**
     * Display a paginated list of categories.
     */
    public function index(IndexCategoryRequest $request): Response
    {
        Gate::authorize('viewAny', Category::class);

        $result = $this->getPaginatedCategories->execute($request->filters());

        return Inertia::render('category/index', [
            'categories' => $result['categories'],
            'counts' => $result['counts'],
            'filters' => $result['filters'],
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Gate::authorize('create', Category::class);

        Category::create([
            'name' => $request->input('name'),
        ]);

        return redirect(route('categories.index'));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        Gate::authorize('update', $category);

        $category->update([
            'name' => $request->input('name'),
        ]);

        return redirect(route('categories.index'));
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $category = Category::findOrFail($id);

        Gate::authorize('delete', $category);

        if ($category->products()->exists()) {
            return back()->withErrors([
                'message' => 'Cannot delete category because it has associated products.'
            ]);
        }

        $category->delete();

        return redirect(route('categories.index'));
    }

    /**
     * Restore the specified category from deleted.
     */
    public function restore($id): RedirectResponse
    {
        $category = Category::withTrashed()->findOrFail($id);

        Gate::authorize('restore', $category);

        $category->restore();

        return redirect(route('categories.index'));
    }
}
