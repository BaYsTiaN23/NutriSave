<?php

namespace App\Http\Controllers;

use App\Models\BillingPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BillingPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BillingPlan::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by currency
        if ($request->has('currency')) {
            $query->where('currency', $request->currency);
        }

        // Order by price
        if ($request->has('order_by_price')) {
            $direction = $request->get('price_direction', 'asc');
            $query->orderByPrice($direction);
        }

        $plans = $query->paginate($request->get('per_page', 15));

        return response()->json($plans);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'promotions_included' => 'required|integer|min:0',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $plan = BillingPlan::create($validated);

        return response()->json([
            'message' => 'Billing plan created successfully',
            'data' => $plan
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(BillingPlan $billingPlan): JsonResponse
    {
        $billingPlan->load('subscriptions.business');

        return response()->json($billingPlan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BillingPlan $billingPlan): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'promotions_included' => 'sometimes|integer|min:0',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $billingPlan->update($validated);

        return response()->json([
            'message' => 'Billing plan updated successfully',
            'data' => $billingPlan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BillingPlan $billingPlan): JsonResponse
    {
        // Check if plan has active subscriptions
        $activeSubscriptions = $billingPlan->subscriptions()->active()->count();
        
        if ($activeSubscriptions > 0) {
            return response()->json([
                'message' => 'Cannot delete plan with active subscriptions'
            ], Response::HTTP_CONFLICT);
        }

        $billingPlan->delete();

        return response()->json([
            'message' => 'Billing plan deleted successfully'
        ]);
    }

    /**
     * Get active billing plans.
     */
    public function active(): JsonResponse
    {
        $plans = BillingPlan::active()
            ->orderByPrice()
            ->get();

        return response()->json($plans);
    }
}
