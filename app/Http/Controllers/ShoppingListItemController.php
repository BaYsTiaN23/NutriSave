<?php

namespace App\Http\Controllers;

use App\Models\ShoppingListItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShoppingListItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $shoppingListItems = ShoppingListItem::with(['shoppingList', 'product'])->paginate(15);
        return response()->json($shoppingListItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shopping_list_id' => 'required|integer|exists:shopping_lists,id',
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|numeric|min:0.01|max:99999999.99',
            'subtotal' => 'required|numeric|min:0|max:99999999.99',
        ]);

        $shoppingListItem = ShoppingListItem::create($validated);
        $shoppingListItem->load(['shoppingList', 'product']);

        return response()->json($shoppingListItem, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ShoppingListItem $shoppingListItem): JsonResponse
    {
        $shoppingListItem->load(['shoppingList.menu', 'product.store']);
        return response()->json($shoppingListItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShoppingListItem $shoppingListItem): JsonResponse
    {
        $validated = $request->validate([
            'shopping_list_id' => 'sometimes|required|integer|exists:shopping_lists,id',
            'product_id' => 'sometimes|required|integer|exists:products,id',
            'quantity' => 'sometimes|required|numeric|min:0.01|max:99999999.99',
            'subtotal' => 'sometimes|required|numeric|min:0|max:99999999.99',
        ]);

        $shoppingListItem->update($validated);
        $shoppingListItem->load(['shoppingList', 'product']);

        return response()->json($shoppingListItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShoppingListItem $shoppingListItem): JsonResponse
    {
        $shoppingListItem->delete();
        return response()->json(null, 204);
    }
}
