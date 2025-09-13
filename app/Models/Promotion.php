<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promotion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'product_id',
        'discount_percentage',
        'target_audience',
        'daily_budget',
        'description',
        'status',
        'start_date',
        'end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'daily_budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'string',
        'target_audience' => 'string',
    ];

    /**
     * Get the business that owns the promotion.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the product that the promotion belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(BusinessProduct::class, 'product_id');
    }

    /**
     * Get the stats for the promotion.
     */
    public function stats(): HasMany
    {
        return $this->hasMany(PromotionStat::class);
    }

    /**
     * Scope a query to only include active promotions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by target audience.
     */
    public function scopeByTargetAudience($query, $audience)
    {
        return $query->where('target_audience', $audience);
    }

    /**
     * Scope a query to only include current promotions.
     */
    public function scopeCurrent($query)
    {
        $today = now()->format('Y-m-d');
        return $query->where('start_date', '<=', $today)
                    ->where(function ($query) use ($today) {
                        $query->whereNull('end_date')
                              ->orWhere('end_date', '>=', $today);
                    });
    }

    /**
     * Check if the promotion is currently active.
     */
    public function isActive(): bool
    {
        $today = now()->format('Y-m-d');
        return $this->status === 'active' && 
               $this->start_date <= $today && 
               ($this->end_date === null || $this->end_date >= $today);
    }
}
