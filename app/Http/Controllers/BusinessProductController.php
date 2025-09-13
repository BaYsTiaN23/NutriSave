<?php

namespace App\Http\Controllers;

use App\Models\BusinessProduct;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BusinessProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BusinessProduct::with('business');

        // Filter by business
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by brand
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }

        // Search by name or SKU
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filter by stock availability
        if ($request->has('in_stock') && $request->in_stock) {
            $query->where('stock', '>', 0);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|max:255|unique:business_products,sku',
            'image_url' => 'nullable|url',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $validated['last_updated'] = now();
        $product = BusinessProduct::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product->load('business')
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessProduct $businessProduct): JsonResponse
    {
        $businessProduct->load(['business', 'promotions.stats']);

        return response()->json($businessProduct);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BusinessProduct $businessProduct): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'sometimes|exists:businesses,id',
            'name' => 'sometimes|string|max:255',
            'brand' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'sku' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('business_products', 'sku')->ignore($businessProduct->id)
            ],
            'image_url' => 'nullable|url',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $validated['last_updated'] = now();
        $businessProduct->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $businessProduct->load('business')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessProduct $businessProduct): JsonResponse
    {
        $businessProduct->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Update product stock.
     */
    public function updateStock(Request $request, BusinessProduct $businessProduct): JsonResponse
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $businessProduct->update([
            'stock' => $validated['stock'],
            'last_updated' => now()
        ]);

        return response()->json([
            'message' => 'Stock updated successfully',
            'data' => $businessProduct
        ]);
    }

    /**
     * Get products by business.
     */
    public function byBusiness(Business $business): JsonResponse
    {
        $products = $business->products()
            ->with('promotions')
            ->paginate(15);

        return response()->json($products);
    }

    /**
     * Get low stock products.
     */
    public function lowStock(Request $request): JsonResponse
    {
        $threshold = $request->get('threshold', 10);
        
        $query = BusinessProduct::where('stock', '<=', $threshold)
            ->where('status', 'active')
            ->with('business');

        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }
}
