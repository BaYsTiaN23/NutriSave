<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Analytic extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'analytics';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'metric',
        'value',
        'date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'decimal:2',
        'date' => 'date',
        'metric' => 'string',
    ];

    /**
     * Get the business that owns the analytic.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Scope a query to filter by metric type.
     */
    public function scopeByMetric($query, $metric)
    {
        return $query->where('metric', $metric);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to get views metrics.
     */
    public function scopeViews($query)
    {
        return $query->where('metric', 'views');
    }

    /**
     * Scope a query to get clicks metrics.
     */
    public function scopeClicks($query)
    {
        return $query->where('metric', 'clicks');
    }

    /**
     * Scope a query to get conversions metrics.
     */
    public function scopeConversions($query)
    {
        return $query->where('metric', 'conversions');
    }

    /**
     * Scope a query to get revenue metrics.
     */
    public function scopeRevenue($query)
    {
        return $query->where('metric', 'revenue');
    }
}
