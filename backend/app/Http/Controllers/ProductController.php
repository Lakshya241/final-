<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category') && !empty($request->category) && strtolower($request->category) !== 'all') {
            $query->where('category', 'LIKE', $request->category);
        }

        if ($request->has('featured') && $request->featured === 'true') {
            $query->where('is_featured', true);
        }

        $products = $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc')->get();

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image_url' => 'required|string',
            'secondary_image_url' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'materials' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        $validated['is_featured'] = $validated['is_featured'] ?? false;

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string',
            'image_url' => 'sometimes|required|string',
            'secondary_image_url' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
            'materials' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
