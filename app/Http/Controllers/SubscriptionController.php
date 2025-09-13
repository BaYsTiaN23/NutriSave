<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Business;
use App\Models\BillingPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subscription::with(['business', 'plan']);

        // Filter by business
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        // Filter by plan
        if ($request->has('plan_id')) {
            $query->where('plan_id', $request->plan_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by due for payment
        if ($request->has('due_for_payment') && $request->due_for_payment) {
            $query->dueForPayment();
        }

        $subscriptions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($subscriptions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'plan_id' => 'required|exists:billing_plans,id',
            'status' => ['sometimes', Rule::in(['active', 'cancelled', 'expired'])],
            'start_date' => 'required|date',
            'next_payment_date' => 'nullable|date|after:start_date',
        ]);

        // Check if business already has an active subscription
        $existingSubscription = Subscription::where('business_id', $validated['business_id'])
            ->where('status', 'active')
            ->first();

        if ($existingSubscription) {
            return response()->json([
                'message' => 'Business already has an active subscription'
            ], Response::HTTP_CONFLICT);
        }

        $subscription = Subscription::create($validated);

        return response()->json([
            'message' => 'Subscription created successfully',
            'data' => $subscription->load(['business', 'plan'])
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription): JsonResponse
    {
        $subscription->load(['business', 'plan', 'paymentHistory']);

        return response()->json($subscription);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'sometimes|exists:businesses,id',
            'plan_id' => 'sometimes|exists:billing_plans,id',
            'status' => ['sometimes', Rule::in(['active', 'cancelled', 'expired'])],
            'start_date' => 'sometimes|date',
            'next_payment_date' => 'nullable|date',
        ]);

        $subscription->update($validated);

        return response()->json([
            'message' => 'Subscription updated successfully',
            'data' => $subscription->load(['business', 'plan'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription): JsonResponse
    {
        $subscription->delete();

        return response()->json([
            'message' => 'Subscription deleted successfully'
        ]);
    }

    /**
     * Cancel a subscription.
     */
    public function cancel(Subscription $subscription): JsonResponse
    {
        if ($subscription->status === 'cancelled') {
            return response()->json([
                'message' => 'Subscription is already cancelled'
            ], Response::HTTP_BAD_REQUEST);
        }

        $subscription->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Subscription cancelled successfully',
            'data' => $subscription
        ]);
    }

    /**
     * Reactivate a subscription.
     */
    public function reactivate(Subscription $subscription): JsonResponse
    {
        if ($subscription->status === 'active') {
            return response()->json([
                'message' => 'Subscription is already active'
            ], Response::HTTP_BAD_REQUEST);
        }

        $subscription->update([
            'status' => 'active',
            'next_payment_date' => now()->addMonth()->format('Y-m-d')
        ]);

        return response()->json([
            'message' => 'Subscription reactivated successfully',
            'data' => $subscription
        ]);
    }

    /**
     * Change subscription plan.
     */
    public function changePlan(Request $request, Subscription $subscription): JsonResponse
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:billing_plans,id',
        ]);

        if ($subscription->plan_id == $validated['plan_id']) {
            return response()->json([
                'message' => 'Subscription is already on this plan'
            ], Response::HTTP_BAD_REQUEST);
        }

        $subscription->update([
            'plan_id' => $validated['plan_id'],
            'next_payment_date' => now()->addMonth()->format('Y-m-d')
        ]);

        return response()->json([
            'message' => 'Subscription plan changed successfully',
            'data' => $subscription->load(['business', 'plan'])
        ]);
    }

    /**
     * Get subscriptions by business.
     */
    public function byBusiness(Business $business): JsonResponse
    {
        $subscriptions = $business->subscriptions()
            ->with(['plan', 'paymentHistory'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($subscriptions);
    }

    /**
     * Get subscriptions by plan.
     */
    public function byPlan(BillingPlan $billingPlan): JsonResponse
    {
        $subscriptions = $billingPlan->subscriptions()
            ->with(['business', 'paymentHistory'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($subscriptions);
    }

    /**
     * Get subscriptions due for payment.
     */
    public function dueForPayment(Request $request): JsonResponse
    {
        $query = Subscription::dueForPayment()->with(['business', 'plan']);

        // Filter by specific date
        if ($request->has('date')) {
            $query->where('next_payment_date', '<=', $request->date);
        }

        $subscriptions = $query->paginate($request->get('per_page', 15));

        return response()->json($subscriptions);
    }

    /**
     * Get subscription statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = Subscription::query();

        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        $totalSubscriptions = $query->count();
        $activeSubscriptions = (clone $query)->active()->count();
        $cancelledSubscriptions = (clone $query)->cancelled()->count();
        $expiredSubscriptions = (clone $query)->expired()->count();
        $dueForPayment = (clone $query)->dueForPayment()->count();

        return response()->json([
            'total_subscriptions' => $totalSubscriptions,
            'active_subscriptions' => $activeSubscriptions,
            'cancelled_subscriptions' => $cancelledSubscriptions,
            'expired_subscriptions' => $expiredSubscriptions,
            'due_for_payment' => $dueForPayment,
            'active_rate' => $totalSubscriptions > 0 ? number_format(($activeSubscriptions / $totalSubscriptions) * 100, 2) . '%' : '0%',
            'churn_rate' => $totalSubscriptions > 0 ? number_format(($cancelledSubscriptions / $totalSubscriptions) * 100, 2) . '%' : '0%'
        ]);
    }

    /**
     * Renew subscription.
     */
    public function renew(Subscription $subscription): JsonResponse
    {
        if (!$subscription->isActive()) {
            return response()->json([
                'message' => 'Only active subscriptions can be renewed'
            ], Response::HTTP_BAD_REQUEST);
        }

        $subscription->update([
            'next_payment_date' => now()->addMonth()->format('Y-m-d')
        ]);

        return response()->json([
            'message' => 'Subscription renewed successfully',
            'data' => $subscription
        ]);
    }
}
