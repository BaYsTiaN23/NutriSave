<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'plan_id',
        'status',
        'start_date',
        'next_payment_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'string',
        'start_date' => 'date',
        'next_payment_date' => 'date',
    ];

    /**
     * Get the business that owns the subscription.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the billing plan for the subscription.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(BillingPlan::class, 'plan_id');
    }

    /**
     * Get the payment history for the subscription.
     */
    public function paymentHistory(): HasMany
    {
        return $this->hasMany(PaymentHistory::class);
    }

    /**
     * Scope a query to only include active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include cancelled subscriptions.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope a query to only include expired subscriptions.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    /**
     * Scope a query to get subscriptions due for payment.
     */
    public function scopeDueForPayment($query)
    {
        return $query->where('next_payment_date', '<=', now()->format('Y-m-d'))
                    ->where('status', 'active');
    }

    /**
     * Check if the subscription is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the subscription is due for payment.
     */
    public function isDueForPayment(): bool
    {
        return $this->next_payment_date <= now()->format('Y-m-d') && $this->isActive();
    }
}
