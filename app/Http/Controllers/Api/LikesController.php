<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikesController extends Controller
{
    /**
     * Store a like or unlike a post.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        $post = Post::find($request->post_id);
        $userId = Auth::id();

        // Check if user already liked the post
        $existingLike = Like::where('post_id', $request->post_id)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            // Unlike the post
            $existingLike->delete();
            $message = 'Post unliked successfully';
            $liked = false;
        } else {
            // Like the post
            Like::create([
                'post_id' => $request->post_id,
                'user_id' => $userId
            ]);
            $message = 'Post liked successfully';
            $liked = true;
        }

        $likesCount = $post->likes()->count();

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'liked' => $liked,
                'likes_count' => $likesCount
            ]
        ]);
    }
}
