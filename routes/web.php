<?php

use App\Http\Controllers\FeedController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

// Main routes
Route::get('/', [\App\Http\Controllers\LandingController::class, 'index'])->name('home');
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
Route::get('/community', [\App\Http\Controllers\CommunityController::class, 'index'])->name('community');
Route::get('/business', [\App\Http\Controllers\BusinessController::class, 'index'])->name('business');
Route::get('/chat', [\App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');

// Social App Routes
Route::get('/feed', [FeedController::class, 'index'])->name('feed');
Route::middleware('auth')->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/comments', [\App\Http\Controllers\CommentsController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comment}', [\App\Http\Controllers\CommentsController::class, 'destroy'])->name('comments.destroy');
    
    // File upload routes
    Route::post('/upload/image', [\App\Http\Controllers\Api\FileUploadController::class, 'uploadImage'])->name('upload.image');
    Route::delete('/upload/image', [\App\Http\Controllers\Api\FileUploadController::class, 'deleteImage'])->name('upload.delete');
});
Route::get('/posts/{id}', [PostController::class, 'show'])->name('posts.show');

// API routes
Route::get('/api/chats', [\App\Http\Controllers\Api\ChatController::class, 'index'])->name('api.chats.index');

require __DIR__.'/chat.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
