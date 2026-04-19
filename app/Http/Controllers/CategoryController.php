<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        return response()->json(
            Category::withCount('subscriptions')->get()
        );
    }

    // POST /api/categories — only admin can store the category
    public function store(Request $request)
    {
        // Simple admin check
        if ($request->user()->email !== config('app.admin_email')) {
            return response()->json(['message' => 'Admin only'], 403);
        }

        $validated = $request->validate([
            'name'  => 'required|string|max:100|unique:categories,name',
            'color' => 'required|string|max:7',
            'icon'  => 'nullable|string|max:10',
        ]);

        return response()->json(
            Category::create($validated), 201
        );
    }

    // PUT /api/categories/{id} — only admin have a permission to update the existing category
    public function update(Request $request, Category $category)
    {
        if ($request->user()->email !== config('app.admin_email')) {
            return response()->json(['message' => 'Admin only'], 403);
        }

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:100',
            'color' => 'sometimes|string|max:7',
            'icon'  => 'nullable|string|max:10',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    // DELETE /api/categories/{id} — only admin can delete the cat
    public function destroy(Request $request, Category $category)
    {
        if ($request->user()->email !== config('app.admin_email')) {
            return response()->json(['message' => 'Admin only'], 403);
        }

        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }
}