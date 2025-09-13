<?php

namespace App\Http\Controllers;

<<<<<<< Updated upstream
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index()
    {
        return Inertia::render('business');
=======
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
        $totalRevenue = $business->analytics()->revenue()->sum('value');
        $totalViews = $business->analytics()->views()->sum('value');

        return response()->json([
            'total_products' => $totalProducts,
            'active_promotions' => $activePromotions,
            'total_revenue' => $totalRevenue,
            'total_views' => $totalViews,
        ]);
    }

    /**
     * Get business products.
     */
    public function products(Business $business): JsonResponse
    {
        $products = $business->products()
            ->with('promotions')
            ->paginate(15);

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
>>>>>>> Stashed changes
    }
}
