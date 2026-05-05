<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Paginated products fetch karna (With Category Relationship)
     */
    public function index(Request $request)
    {
        $query = Product::latest();

        // Check karein ke kya website ne saara data manga hai?
        if ($request->has('all') && $request->all == 'true') {
            return $query->get(); // Yeh poora data (1st, 2nd, 3rd page) bhej dega
        }

        // Dashboard ke liye purani pagination
        return $query->paginate(10);
    }

    /**
     * Naya Product save karna (With Image & Checkboxes)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'metal_type' => 'required|in:gold,silver,artificial,platinum',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $data = $request->all();

        // Image Handling
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        // Checkboxes handle karne ka sahi tareeqa (boolean casting)
        $data['is_new_arrival'] = $request->boolean('is_new_arrival');
        $data['is_top_seller'] = $request->boolean('is_top_seller');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['in_stock'] = $request->boolean('in_stock', true);

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product published successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Ek specific product ki detail
     */
    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    /**
     * Product Update karna (Image replacement ke sath)
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Purani image delete karein
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        // Slugs update karne ke liye (agar name change ho)
        $data['slug'] = Str::slug($request->name);

        $data['is_new_arrival'] = $request->boolean('is_new_arrival');
        $data['is_top_seller'] = $request->boolean('is_top_seller');
        $data['is_featured'] = $request->boolean('is_featured');

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully']);
    }

    /**
     * Product Delete karna aur image bhi storage se hatana
     */
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
