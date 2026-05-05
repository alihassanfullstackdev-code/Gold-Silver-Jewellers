<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Saari categories fetch karne ke liye (Frontend Dropdown aur List ke liye)
     */
    public function index(Request $request)
    {
        // Agar Modal se request aaye (?all=true), to saari categories bhej do
        if ($request->has('all')) {
            return response()->json(Category::orderBy('name', 'asc')->get());
        }

        // Dashboard table ke liye default pagination
        return response()->json(Category::latest()->paginate(10));
    }
    /**
     * Nayi category save karne ke liye
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * Ek specific category dikhane ke liye (Zaroorat parne par)
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Category ka naam update karne ke liye
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    /**
     * Category delete karne ke liye
     */
    public function destroy(Category $category)
    {
        // Yaad rakhen: ON DELETE CASCADE ki wajah se iske products bhi delete ho jayenge
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
