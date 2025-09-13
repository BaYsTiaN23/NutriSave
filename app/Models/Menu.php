<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'diet_type',
        'total_calories',
        'total_cost',
        'week_start_date',
    ];

    protected $casts = [
        'total_calories' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'week_start_date' => 'date',
    ];

    /**
     * Get the user that owns the menu.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all meals for the menu.
     */
    public function meals(): HasMany
    {
        return $this->hasMany(Meal::class);
    }

    /**
     * Get the shopping list associated with the menu.
     */
    public function shoppingList(): HasOne
    {
        return $this->hasOne(ShoppingList::class);
    }
}
