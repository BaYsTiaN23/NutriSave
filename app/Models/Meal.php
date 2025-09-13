<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'meal_type',
        'scheduled_time',
    ];

    protected $casts = [
        'scheduled_time' => 'datetime:H:i:s',
    ];

    /**
     * Get the menu that owns the meal.
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    /**
     * The products that belong to the meal.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'meal_products')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
