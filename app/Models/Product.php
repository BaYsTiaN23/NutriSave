<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'category',
        'unit',
        'price_per_unit',
        'stock_available',
        'nutrition_info',
        'barcode',
    ];

    protected $casts = [
        'nutrition_info' => 'array',
        'price_per_unit' => 'decimal:2',
        'stock_available' => 'boolean',
    ];

    /**
     * Get the store that owns the product.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * The meals that belong to the product.
     */
    public function meals(): BelongsToMany
    {
        return $this->belongsToMany(Meal::class, 'meal_products')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
