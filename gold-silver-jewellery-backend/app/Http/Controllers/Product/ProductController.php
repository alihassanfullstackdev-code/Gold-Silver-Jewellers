<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->latest(); // Category load karna zaroori hai

        if ($request->has('all') && $request->all == 'true') {
            return response()->json($query->get());
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'metal_type' => 'required|in:gold,silver,artificial,platinum',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        try {
            $data = $request->all();

            // Unique Slug Logic: Agar same name ho toh time() add kar dega crash hone ki bajaye
            $data['slug'] = Str::slug($request->name) . '-' . rand(100, 999);

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            $data['is_new_arrival'] = $request->boolean('is_new_arrival');
            $data['is_top_seller'] = $request->boolean('is_top_seller');
            $data['is_featured'] = $request->boolean('is_featured');
            $data['in_stock'] = $request->boolean('in_stock', true);

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product published successfully',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            // Asal error dekhne ke liye response
            return response()->json([
                'success' => false,
                'message' => 'Database Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        // Slug update safety
        $data['slug'] = Str::slug($request->name) . '-' . $product->id;

        $data['is_new_arrival'] = $request->boolean('is_new_arrival');
        $data['is_top_seller'] = $request->boolean('is_top_seller');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['in_stock'] = $request->boolean('in_stock');

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully']);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}