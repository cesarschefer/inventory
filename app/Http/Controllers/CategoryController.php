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
        $search = request('search', '');
        $status = request('status', '3');
        $page = request('page', 1);

        $query = Category::withTrashed();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($status === '1') {
            $query->whereNull('deleted_at');
        } elseif ($status === '2') {
            $query->whereNotNull('deleted_at');
        }

        $categories = $query->orderBy("name", "ASC")->paginate(
            perPage: 10,
            page: $page
        );

        $activeCount = Category::count();
        $inactiveCount = Category::onlyTrashed()->count();

        return Inertia::render('category/index', [
            'categories' => [
                'data' => CategoryResource::collection($categories)->resolve(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'from' => $categories->firstItem(),
                'to' => $categories->lastItem(),
                'next_page_url' => $categories->nextPageUrl(),
                'prev_page_url' => $categories->previousPageUrl(),
            ],
            'counts' => [
                'active' => $activeCount,
                'inactive' => $inactiveCount,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
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
