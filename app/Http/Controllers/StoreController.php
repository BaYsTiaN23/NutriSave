<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $stores = Store::with('products')->paginate(15);
        return response()->json($stores);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'rating' => 'nullable|numeric|between:0,10',
        ]);

        $store = Store::create($validated);
        $store->load('products');

        return response()->json($store, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store): JsonResponse
    {
        $store->load('products');
        return response()->json($store);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'rating' => 'nullable|numeric|between:0,10',
        ]);

        $store->update($validated);
        $store->load('products');

        return response()->json($store);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store): JsonResponse
    {
        $store->delete();
        return response()->json(null, 204);
    }
}
