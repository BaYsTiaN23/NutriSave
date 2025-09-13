<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'branch_name',
        'industry',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the products for the business.
     */
    public function products(): HasMany
    {
        return $this->hasMany(BusinessProduct::class);
    }

    /**
     * Get the promotions for the business.
     */
    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    /**
     * Get the customer insights for the business.
     */
    public function customerInsights(): HasMany
    {
        return $this->hasMany(CustomerInsight::class);
    }

    /**
     * Get the analytics for the business.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(Analytic::class);
    }

    /**
     * Get the subscriptions for the business.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Scope a query to only include active businesses.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by industry.
     */
    public function scopeByIndustry($query, $industry)
    {
        return $query->where('industry', $industry);
    }
}
