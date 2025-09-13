<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $menus = Menu::with(['user', 'meals', 'shoppingList'])->paginate(15);
        return response()->json($menus);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'diet_type' => ['required', Rule::in(['diabetes', 'hypertension', 'weight_loss', 'muscle_gain', 'vegetarian', 'budget'])],
            'total_calories' => 'required|numeric|min:0|max:99999999.99',
            'total_cost' => 'required|numeric|min:0|max:99999999.99',
            'week_start_date' => 'required|date',
        ]);

        $menu = Menu::create($validated);
        $menu->load(['user', 'meals', 'shoppingList']);

        return response()->json($menu, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu): JsonResponse
    {
        $menu->load(['user', 'meals.products', 'shoppingList.shoppingListItems.product']);
        return response()->json($menu);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|required|integer|exists:users,id',
            'diet_type' => ['sometimes', Rule::in(['diabetes', 'hypertension', 'weight_loss', 'muscle_gain', 'vegetarian', 'budget'])],
            'total_calories' => 'sometimes|required|numeric|min:0|max:99999999.99',
            'total_cost' => 'sometimes|required|numeric|min:0|max:99999999.99',
            'week_start_date' => 'sometimes|required|date',
        ]);

        $menu->update($validated);
        $menu->load(['user', 'meals', 'shoppingList']);

        return response()->json($menu);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu): JsonResponse
    {
        $menu->delete();
        return response()->json(null, 204);
    }
}
