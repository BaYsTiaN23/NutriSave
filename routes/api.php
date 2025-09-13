<?php

use App\Http\Controllers\Api\CommentsController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\LikesController;
use App\Http\Controllers\Api\PostsController;
use App\Http\Controllers\Api\SharesController;
use App\Http\Controllers\Api\TipOfDayController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\BusinessProductController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\BillingPlanController;
use App\Http\Controllers\PaymentHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:web')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes (for now, you can add auth middleware later)
Route::apiResource('api-posts', PostsController::class);

// Tip of the day route
Route::get('tip-of-day', [TipOfDayController::class, 'index']);

// Protected routes (require authentication)
Route::middleware('auth:web')->group(function () {
    // Likes routes
    Route::post('likes', [LikesController::class, 'store']);
    
    // Comments routes
    Route::post('comments', [CommentsController::class, 'store']);
    Route::delete('comments/{comment}', [CommentsController::class, 'destroy']);
    
    // Shares routes
    Route::post('shares', [SharesController::class, 'store']);
});

// B2B Business Panel API Routes
Route::prefix('b2b')->group(function () {
    // Business routes
    Route::apiResource('businesses', BusinessController::class);
    Route::get('businesses/{business}/analytics', [BusinessController::class, 'analytics']);
    Route::get('businesses/{business}/products', [BusinessController::class, 'products']);
    Route::get('businesses/{business}/promotions', [BusinessController::class, 'promotions']);
    
    // Business Products routes
    Route::apiResource('business-products', BusinessProductController::class);
    Route::patch('business-products/{businessProduct}/stock', [BusinessProductController::class, 'updateStock']);
    Route::get('businesses/{business}/products', [BusinessProductController::class, 'byBusiness']);
    Route::get('business-products/low-stock', [BusinessProductController::class, 'lowStock']);
    
    // Promotions routes
    Route::apiResource('promotions', PromotionController::class);
    Route::patch('promotions/{promotion}/pause', [PromotionController::class, 'pause']);
    Route::patch('promotions/{promotion}/activate', [PromotionController::class, 'activate']);
    Route::get('promotions/{promotion}/statistics', [PromotionController::class, 'statistics']);
    Route::get('businesses/{business}/promotions', [PromotionController::class, 'byBusiness']);
    Route::get('promotions/active', [PromotionController::class, 'active']);
    
    // Analytics routes
    Route::apiResource('analytics', AnalyticsController::class);
    Route::get('businesses/{business}/analytics/summary', [AnalyticsController::class, 'businessSummary']);
    Route::get('analytics/metric/{metric}', [AnalyticsController::class, 'byMetric']);
    Route::get('analytics/trending', [AnalyticsController::class, 'trending']);
    Route::post('analytics/compare', [AnalyticsController::class, 'compare']);
    
    // Subscriptions routes
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::patch('subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel']);
    Route::patch('subscriptions/{subscription}/reactivate', [SubscriptionController::class, 'reactivate']);
    Route::patch('subscriptions/{subscription}/change-plan', [SubscriptionController::class, 'changePlan']);
    Route::patch('subscriptions/{subscription}/renew', [SubscriptionController::class, 'renew']);
    Route::get('businesses/{business}/subscriptions', [SubscriptionController::class, 'byBusiness']);
    Route::get('billing-plans/{billingPlan}/subscriptions', [SubscriptionController::class, 'byPlan']);
    Route::get('subscriptions/due-for-payment', [SubscriptionController::class, 'dueForPayment']);
    Route::get('subscriptions/statistics', [SubscriptionController::class, 'statistics']);
    
    // Billing Plans routes
    Route::apiResource('billing-plans', BillingPlanController::class);
    Route::get('billing-plans/active', [BillingPlanController::class, 'active']);
    
    // Payment History routes
    Route::apiResource('payment-history', PaymentHistoryController::class);
    Route::get('subscriptions/{subscription}/payment-history', [PaymentHistoryController::class, 'bySubscription']);
    Route::get('payment-history/successful', [PaymentHistoryController::class, 'successful']);
    Route::get('payment-history/failed', [PaymentHistoryController::class, 'failed']);
    Route::get('payment-history/statistics', [PaymentHistoryController::class, 'statistics']);
});
