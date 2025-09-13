<?php

namespace App\Http\Controllers;

use App\Models\PaymentHistory;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PaymentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentHistory::with('subscription.business');

        // Filter by subscription
        if ($request->has('subscription_id')) {
            $query->where('subscription_id', $request->subscription_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by currency
        if ($request->has('currency')) {
            $query->where('currency', $request->currency);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $payments = $query->orderBy('payment_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($payments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'payment_date' => 'required|date',
            'status' => ['sometimes', Rule::in(['paid', 'failed', 'pending'])],
        ]);

        $payment = PaymentHistory::create($validated);

        return response()->json([
            'message' => 'Payment record created successfully',
            'data' => $payment->load('subscription.business')
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentHistory $paymentHistory): JsonResponse
    {
        $paymentHistory->load('subscription.business');

        return response()->json($paymentHistory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentHistory $paymentHistory): JsonResponse
    {
        $validated = $request->validate([
            'subscription_id' => 'sometimes|exists:subscriptions,id',
            'amount' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'payment_date' => 'sometimes|date',
            'status' => ['sometimes', Rule::in(['paid', 'failed', 'pending'])],
        ]);

        $paymentHistory->update($validated);

        return response()->json([
            'message' => 'Payment record updated successfully',
            'data' => $paymentHistory->load('subscription.business')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentHistory $paymentHistory): JsonResponse
    {
        $paymentHistory->delete();

        return response()->json([
            'message' => 'Payment record deleted successfully'
        ]);
    }

    /**
     * Get payments by subscription.
     */
    public function bySubscription(Subscription $subscription): JsonResponse
    {
        $payments = $subscription->paymentHistory()
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        return response()->json($payments);
    }

    /**
     * Get successful payments.
     */
    public function successful(Request $request): JsonResponse
    {
        $query = PaymentHistory::paid()->with('subscription.business');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $payments = $query->orderBy('payment_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($payments);
    }

    /**
     * Get failed payments.
     */
    public function failed(Request $request): JsonResponse
    {
        $query = PaymentHistory::failed()->with('subscription.business');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $payments = $query->orderBy('payment_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($payments);
    }

    /**
     * Get payment statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = PaymentHistory::query();

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        } else {
            // Default to last 30 days
            $query->dateRange(now()->subDays(30), now());
        }

        $totalPayments = $query->count();
        $successfulPayments = (clone $query)->paid()->count();
        $failedPayments = (clone $query)->failed()->count();
        $pendingPayments = (clone $query)->pending()->count();
        
        $totalRevenue = (clone $query)->paid()->sum('amount');
        $averagePayment = $successfulPayments > 0 ? $totalRevenue / $successfulPayments : 0;

        return response()->json([
            'period' => [
                'start_date' => $request->get('start_date', now()->subDays(30)->format('Y-m-d')),
                'end_date' => $request->get('end_date', now()->format('Y-m-d'))
            ],
            'total_payments' => $totalPayments,
            'successful_payments' => $successfulPayments,
            'failed_payments' => $failedPayments,
            'pending_payments' => $pendingPayments,
            'success_rate' => $totalPayments > 0 ? number_format(($successfulPayments / $totalPayments) * 100, 2) . '%' : '0%',
            'failure_rate' => $totalPayments > 0 ? number_format(($failedPayments / $totalPayments) * 100, 2) . '%' : '0%',
            'total_revenue' => number_format($totalRevenue, 2),
            'average_payment' => number_format($averagePayment, 2)
        ]);
    }
}
