<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopping_list_id',
        'product_id',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    /**
     * Get the shopping list that owns the item.
     */
    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    /**
     * Get the product that this item refers to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
