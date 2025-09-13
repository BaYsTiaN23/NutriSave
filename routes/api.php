<?php

use App\Http\Controllers\Api\CommentsController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\LikesController;
use App\Http\Controllers\Api\PostsController;
use App\Http\Controllers\Api\SharesController;
use App\Http\Controllers\Api\TipOfDayController;
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
