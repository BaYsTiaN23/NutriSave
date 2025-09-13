<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BusinessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by industry
        if ($request->has('industry')) {
            $query->where('industry', $request->industry);
        }

        // Search by name or branch name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('branch_name', 'like', "%{$search}%");
            });
        }

        $businesses = $query->paginate($request->get('per_page', 15));

        return response()->json($businesses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'branch_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $business = Business::create($validated);

        return response()->json([
            'message' => 'Business created successfully',
            'data' => $business
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Business $business): JsonResponse
    {
        $business->load([
            'products',
            'promotions',
            'customerInsights',
            'analytics',
            'subscriptions'
        ]);

        return response()->json($business);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Business $business): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'branch_name' => 'sometimes|string|max:255',
            'industry' => 'sometimes|string|max:255',
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        $business->update($validated);

        return response()->json([
            'message' => 'Business updated successfully',
            'data' => $business
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Business $business): JsonResponse
    {
        $business->delete();

        return response()->json([
            'message' => 'Business deleted successfully'
        ]);
    }

    /**
     * Get business analytics summary.
     */
    public function analytics(Business $business): JsonResponse
    {
        $totalProducts = $business->products()->count();
        $activePromotions = $business->promotions()->active()->count();
        $totalRevenue = $business->analytics()->where('metric', 'revenue')->sum('value');
        $totalViews = $business->analytics()->where('metric', 'views')->sum('value');
        $totalClicks = $business->analytics()->where('metric', 'clicks')->sum('value');
        $conversions = $business->analytics()->where('metric', 'conversions')->sum('value');

        // Calculate CTR and conversion rate
        $ctr = $totalViews > 0 ? ($totalClicks / $totalViews) * 100 : 0;
        $conversionRate = $totalClicks > 0 ? ($conversions / $totalClicks) * 100 : 0;

        return response()->json([
            'totalViews' => (int) $totalViews,
            'totalClicks' => (int) $totalClicks,
            'conversions' => (int) $conversions,
            'revenue' => (float) $totalRevenue,
            'ctr' => round($ctr, 1),
            'conversionRate' => round($conversionRate, 1),
            'total_products' => $totalProducts,
            'active_promotions' => $activePromotions,
        ]);
    }

    /**
     * Get business products.
     */
    public function products(Request $request, Business $business): JsonResponse
    {
        $query = $business->products()->with('promotions');

        // Handle sorting
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'asc');
        
        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['id', 'name', 'brand', 'category', 'price', 'stock', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->orderBy('created_at', 'asc'); // Default fallback
        }

        // Handle filtering
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('brand')) {
            $query->where('brand', 'like', '%' . $request->brand . '%');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Handle pagination
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100); // Limit max results per page
        
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get business promotions.
     */
    public function promotions(Business $business): JsonResponse
    {
        $promotions = $business->promotions()
            ->with(['product', 'stats'])
            ->paginate(15);

        return response()->json($promotions);
    }
}
