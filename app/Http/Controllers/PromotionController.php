<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Promotion::with(['business', 'product']);

        // Filter by business
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by target audience
        if ($request->has('target_audience')) {
            $query->where('target_audience', $request->target_audience);
        }

        // Filter by active promotions
        if ($request->has('active') && $request->active) {
            $query->current();
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('start_date', [$request->start_date, $request->end_date]);
        }

        $promotions = $query->paginate($request->get('per_page', 15));

        return response()->json($promotions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'product_id' => 'required|exists:business_products,id',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'target_audience' => ['required', Rule::in(['families', 'young_adults', 'seniors', 'students', 'all'])],
            'daily_budget' => 'required|numeric|min:0',
            'description' => 'required|string',
            'status' => ['sometimes', Rule::in(['active', 'paused'])],
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $promotion = Promotion::create($validated);

        return response()->json([
            'message' => 'Promotion created successfully',
            'data' => $promotion->load(['business', 'product'])
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Promotion $promotion): JsonResponse
    {
        $promotion->load(['business', 'product', 'stats']);

        return response()->json($promotion);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'sometimes|exists:businesses,id',
            'product_id' => 'sometimes|exists:business_products,id',
            'discount_percentage' => 'sometimes|numeric|min:0|max:100',
            'target_audience' => ['sometimes', Rule::in(['families', 'young_adults', 'seniors', 'students', 'all'])],
            'daily_budget' => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string',
            'status' => ['sometimes', Rule::in(['active', 'paused'])],
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $promotion->update($validated);

        return response()->json([
            'message' => 'Promotion updated successfully',
            'data' => $promotion->load(['business', 'product'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion): JsonResponse
    {
        $promotion->delete();

        return response()->json([
            'message' => 'Promotion deleted successfully'
        ]);
    }

    /**
     * Pause a promotion.
     */
    public function pause(Promotion $promotion): JsonResponse
    {
        $promotion->update(['status' => 'paused']);

        return response()->json([
            'message' => 'Promotion paused successfully',
            'data' => $promotion
        ]);
    }

    /**
     * Activate a promotion.
     */
    public function activate(Promotion $promotion): JsonResponse
    {
        $promotion->update(['status' => 'active']);

        return response()->json([
            'message' => 'Promotion activated successfully',
            'data' => $promotion
        ]);
    }

    /**
     * Get promotion statistics.
     */
    public function statistics(Promotion $promotion, Request $request): JsonResponse
    {
        $query = $promotion->stats();

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $stats = $query->get();

        $totalViews = $stats->sum('views');
        $totalClicks = $stats->sum('clicks');
        $totalConversions = $stats->sum('conversions');
        $totalRevenue = $stats->sum('revenue');

        $avgCtr = $totalViews > 0 ? ($totalClicks / $totalViews) * 100 : 0;
        $avgConversionRate = $totalClicks > 0 ? ($totalConversions / $totalClicks) * 100 : 0;
        $avgRevenuePerConversion = $totalConversions > 0 ? $totalRevenue / $totalConversions : 0;

        return response()->json([
            'total_views' => $totalViews,
            'total_clicks' => $totalClicks,
            'total_conversions' => $totalConversions,
            'total_revenue' => number_format($totalRevenue, 2),
            'average_ctr' => number_format($avgCtr, 2) . '%',
            'average_conversion_rate' => number_format($avgConversionRate, 2) . '%',
            'average_revenue_per_conversion' => number_format($avgRevenuePerConversion, 2),
            'daily_stats' => $stats
        ]);
    }

    /**
     * Get promotions by business.
     */
    public function byBusiness(Business $business): JsonResponse
    {
        $promotions = $business->promotions()
            ->with(['product', 'stats'])
            ->paginate(15);

        return response()->json($promotions);
    }

    /**
     * Get current active promotions.
     */
    public function active(Request $request): JsonResponse
    {
        $query = Promotion::current()->active()->with(['business', 'product']);

        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        if ($request->has('target_audience')) {
            $query->where('target_audience', $request->target_audience);
        }

        $promotions = $query->paginate($request->get('per_page', 15));

        return response()->json($promotions);
    }
}
