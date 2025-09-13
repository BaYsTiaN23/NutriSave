<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $meals = Meal::with(['menu', 'products'])->paginate(15);
        return response()->json($meals);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'menu_id' => 'required|integer|exists:menus,id',
            'meal_type' => ['required', Rule::in(['breakfast', 'lunch', 'dinner', 'snack'])],
            'scheduled_time' => 'required|date_format:H:i:s',
        ]);

        $meal = Meal::create($validated);
        $meal->load(['menu', 'products']);

        return response()->json($meal, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Meal $meal): JsonResponse
    {
        $meal->load(['menu.user', 'products.store']);
        return response()->json($meal);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Meal $meal): JsonResponse
    {
        $validated = $request->validate([
            'menu_id' => 'sometimes|required|integer|exists:menus,id',
            'meal_type' => ['sometimes', Rule::in(['breakfast', 'lunch', 'dinner', 'snack'])],
            'scheduled_time' => 'sometimes|required|date_format:H:i:s',
        ]);

        $meal->update($validated);
        $meal->load(['menu', 'products']);

        return response()->json($meal);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Meal $meal): JsonResponse
    {
        $meal->delete();
        return response()->json(null, 204);
    }

    /**
     * Attach a product to the meal with quantity.
     */
    public function attachProduct(Request $request, Meal $meal): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|numeric|min:0.01|max:99999999.99',
        ]);

        $meal->products()->attach($validated['product_id'], [
            'quantity' => $validated['quantity']
        ]);

        $meal->load(['menu', 'products']);
        return response()->json($meal);
    }

    /**
     * Detach a product from the meal.
     */
    public function detachProduct(Meal $meal, int $productId): JsonResponse
    {
        $meal->products()->detach($productId);
        $meal->load(['menu', 'products']);
        return response()->json($meal);
    }
}
