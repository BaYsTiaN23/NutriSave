<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShoppingListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $shoppingLists = ShoppingList::with(['menu', 'shoppingListItems.product'])->paginate(15);
        return response()->json($shoppingLists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'menu_id' => 'required|integer|exists:menus,id',
            'total_cost' => 'required|numeric|min:0|max:99999999.99',
        ]);

        $shoppingList = ShoppingList::create($validated);
        $shoppingList->load(['menu', 'shoppingListItems.product']);

        return response()->json($shoppingList, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ShoppingList $shoppingList): JsonResponse
    {
        $shoppingList->load(['menu.user', 'shoppingListItems.product.store']);
        return response()->json($shoppingList);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShoppingList $shoppingList): JsonResponse
    {
        $validated = $request->validate([
            'menu_id' => 'sometimes|required|integer|exists:menus,id',
            'total_cost' => 'sometimes|required|numeric|min:0|max:99999999.99',
        ]);

        $shoppingList->update($validated);
        $shoppingList->load(['menu', 'shoppingListItems.product']);

        return response()->json($shoppingList);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShoppingList $shoppingList): JsonResponse
    {
        $shoppingList->delete();
        return response()->json(null, 204);
    }
}
