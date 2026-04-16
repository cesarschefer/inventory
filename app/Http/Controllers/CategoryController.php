<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index()
    {
        $categories = Category::withTrashed()->get();

        return Inertia::render('category/index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        Category::create([
            'name' => $request->input('name'),
        ]);
        return redirect(route('categories.index'));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ) {
        $category->update([
            'name' => $request->input('name'),
        ]);

        return redirect(route('categories.index'));
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'The category has products associated with it.',
            ], 400);
        }

        $category->delete();
        return redirect(route('categories.index'));
    }

    /**
     * Restore the specified category from deleted.
     */
    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        return redirect(route('categories.index'));
    }
}
