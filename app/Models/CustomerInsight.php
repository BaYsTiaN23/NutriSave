<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerInsight extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'customer_insights';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'demographic',
        'percentage',
        'avg_spend',
        'top_products',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'percentage' => 'integer',
        'avg_spend' => 'decimal:2',
        'top_products' => 'array',
    ];

    /**
     * Get the business that owns the insight.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Scope a query to filter by demographic.
     */
    public function scopeByDemographic($query, $demographic)
    {
        return $query->where('demographic', $demographic);
    }

    /**
     * Scope a query to order by percentage in descending order.
     */
    public function scopeOrderByPercentage($query)
    {
        return $query->orderBy('percentage', 'desc');
    }

    /**
     * Scope a query to order by average spend in descending order.
     */
    public function scopeOrderByAvgSpend($query)
    {
        return $query->orderBy('avg_spend', 'desc');
    }
}
