<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionStat extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promotion_stats';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'promotion_id',
        'date',
        'views',
        'clicks',
        'conversions',
        'revenue',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'views' => 'integer',
        'clicks' => 'integer',
        'conversions' => 'integer',
        'revenue' => 'decimal:2',
    ];

    /**
     * Get the promotion that owns the stat.
     */
    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Calculate click-through rate (CTR).
     */
    public function getClickThroughRateAttribute(): float
    {
        return $this->views > 0 ? ($this->clicks / $this->views) * 100 : 0;
    }

    /**
     * Calculate conversion rate.
     */
    public function getConversionRateAttribute(): float
    {
        return $this->clicks > 0 ? ($this->conversions / $this->clicks) * 100 : 0;
    }

    /**
     * Calculate revenue per conversion.
     */
    public function getRevenuePerConversionAttribute(): float
    {
        return $this->conversions > 0 ? $this->revenue / $this->conversions : 0;
    }
}
