<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::with(['store', 'meals'])->paginate(15);
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'required|integer|exists:stores,id',
            'name' => 'required|string|max:255',
            'category' => ['required', Rule::in(['fruit', 'protein', 'cereal', 'vegetable', 'dairy', 'other'])],
            'unit' => 'required|string|max:50',
            'price_per_unit' => 'required|numeric|min:0|max:99999999.99',
            'stock_available' => 'boolean',
            'nutrition_info' => 'nullable|array',
            'barcode' => 'nullable|string|max:255',
        ]);

        $product = Product::create($validated);
        $product->load(['store', 'meals']);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product->load(['store', 'meals']);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'sometimes|required|integer|exists:stores,id',
            'name' => 'sometimes|required|string|max:255',
            'category' => ['sometimes', Rule::in(['fruit', 'protein', 'cereal', 'vegetable', 'dairy', 'other'])],
            'unit' => 'sometimes|required|string|max:50',
            'price_per_unit' => 'sometimes|required|numeric|min:0|max:99999999.99',
            'stock_available' => 'boolean',
            'nutrition_info' => 'nullable|array',
            'barcode' => 'nullable|string|max:255',
        ]);

        $product->update($validated);
        $product->load(['store', 'meals']);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(null, 204);
    }
}
