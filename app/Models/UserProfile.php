<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'age',
        'weight',
        'height',
        'medical_condition',
        'dietary_preferences',
        'allergens',
        'weekly_budget',
        'goal',
    ];

    protected $casts = [
        'medical_condition' => 'array',
        'dietary_preferences' => 'array',
        'allergens' => 'array',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'weekly_budget' => 'decimal:2',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
