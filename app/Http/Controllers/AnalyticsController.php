<?php

namespace App\Http\Controllers;

use App\Models\Analytic;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Analytic::with('business');

        // Filter by business
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        // Filter by metric type
        if ($request->has('metric')) {
            $query->where('metric', $request->metric);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Filter by specific date
        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        $analytics = $query->orderBy('date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($analytics);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'metric' => ['required', Rule::in(['views', 'clicks', 'conversions', 'revenue'])],
            'value' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $analytic = Analytic::create($validated);

        return response()->json([
            'message' => 'Analytic record created successfully',
            'data' => $analytic->load('business')
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Analytic $analytic): JsonResponse
    {
        $analytic->load('business');

        return response()->json($analytic);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Analytic $analytic): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'sometimes|exists:businesses,id',
            'metric' => ['sometimes', Rule::in(['views', 'clicks', 'conversions', 'revenue'])],
            'value' => 'sometimes|numeric|min:0',
            'date' => 'sometimes|date',
        ]);

        $analytic->update($validated);

        return response()->json([
            'message' => 'Analytic record updated successfully',
            'data' => $analytic->load('business')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Analytic $analytic): JsonResponse
    {
        $analytic->delete();

        return response()->json([
            'message' => 'Analytic record deleted successfully'
        ]);
    }

    /**
     * Get analytics summary for a business.
     */
    public function businessSummary(Business $business, Request $request): JsonResponse
    {
        $query = $business->analytics();

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        } else {
            // Default to last 30 days
            $query->dateRange(now()->subDays(30)->format('Y-m-d'), now()->format('Y-m-d'));
        }

        $analytics = $query->get();

        $totalViews = $analytics->where('metric', 'views')->sum('value');
        $totalClicks = $analytics->where('metric', 'clicks')->sum('value');
        $totalConversions = $analytics->where('metric', 'conversions')->sum('value');
        $totalRevenue = $analytics->where('metric', 'revenue')->sum('value');

        $ctr = $totalViews > 0 ? ($totalClicks / $totalViews) * 100 : 0;
        $conversionRate = $totalClicks > 0 ? ($totalConversions / $totalClicks) * 100 : 0;

        return response()->json([
            'business_id' => $business->id,
            'business_name' => $business->name,
            'period' => [
                'start_date' => $request->get('start_date', now()->subDays(30)->format('Y-m-d')),
                'end_date' => $request->get('end_date', now()->format('Y-m-d'))
            ],
            'metrics' => [
                'total_views' => $totalViews,
                'total_clicks' => $totalClicks,
                'total_conversions' => $totalConversions,
                'total_revenue' => number_format($totalRevenue, 2),
                'click_through_rate' => number_format($ctr, 2) . '%',
                'conversion_rate' => number_format($conversionRate, 2) . '%',
                'revenue_per_conversion' => $totalConversions > 0 ? number_format($totalRevenue / $totalConversions, 2) : '0.00'
            ]
        ]);
    }

    /**
     * Get analytics by metric type.
     */
    public function byMetric(Request $request, string $metric): JsonResponse
    {
        if (!in_array($metric, ['views', 'clicks', 'conversions', 'revenue'])) {
            return response()->json([
                'message' => 'Invalid metric type'
            ], Response::HTTP_BAD_REQUEST);
        }

        $query = Analytic::byMetric($metric)->with('business');

        // Filter by business
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $analytics = $query->orderBy('date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($analytics);
    }

    /**
     * Get trending analytics data.
     */
    public function trending(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);
        $startDate = now()->subDays($days)->format('Y-m-d');
        $endDate = now()->format('Y-m-d');

        $query = Analytic::dateRange($startDate, $endDate)
            ->with('business');

        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        $analytics = $query->get()
            ->groupBy(['date', 'metric'])
            ->map(function ($dateGroup) {
                return $dateGroup->map(function ($metricGroup) {
                    return $metricGroup->sum('value');
                });
            });

        return response()->json([
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'days' => $days
            ],
            'data' => $analytics
        ]);
    }

    /**
     * Compare analytics between periods.
     */
    public function compare(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'sometimes|exists:businesses,id',
            'current_start' => 'required|date',
            'current_end' => 'required|date|after:current_start',
            'previous_start' => 'required|date',
            'previous_end' => 'required|date|after:previous_start',
        ]);

        $currentQuery = Analytic::dateRange($validated['current_start'], $validated['current_end']);
        $previousQuery = Analytic::dateRange($validated['previous_start'], $validated['previous_end']);

        if (isset($validated['business_id'])) {
            $currentQuery->where('business_id', $validated['business_id']);
            $previousQuery->where('business_id', $validated['business_id']);
        }

        $currentData = $currentQuery->get()->groupBy('metric')->map->sum('value');
        $previousData = $previousQuery->get()->groupBy('metric')->map->sum('value');

        $comparison = [];
        foreach (['views', 'clicks', 'conversions', 'revenue'] as $metric) {
            $current = $currentData->get($metric, 0);
            $previous = $previousData->get($metric, 0);
            $change = $previous > 0 ? (($current - $previous) / $previous) * 100 : ($current > 0 ? 100 : 0);

            $comparison[$metric] = [
                'current' => $current,
                'previous' => $previous,
                'change_percentage' => number_format($change, 2),
                'trend' => $change > 0 ? 'up' : ($change < 0 ? 'down' : 'flat')
            ];
        }

        return response()->json([
            'current_period' => [
                'start_date' => $validated['current_start'],
                'end_date' => $validated['current_end']
            ],
            'previous_period' => [
                'start_date' => $validated['previous_start'],
                'end_date' => $validated['previous_end']
            ],
            'comparison' => $comparison
        ]);
    }
}
