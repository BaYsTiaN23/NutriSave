<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $posts = Post::with(['user', 'likes', 'comments', 'shares'])
            ->withCount(['likes', 'comments', 'shares'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|in:Recipes,Organizations,Offers,Weekly Menu',
            'content' => 'required|string',
            'lugar' => 'nullable|string|max:255',
            'tags' => 'nullable|string',
            'image' => 'nullable|string' // Changed from url to string for more flexibility
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
            'lugar' => $request->lugar,
            'tags' => $request->tags,
            'image' => $request->image // Save the provided image URL
        ]);

        $post->load(['user', 'likes', 'comments', 'shares']);
        $post->loadCount(['likes', 'comments', 'shares']);

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'data' => $post
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $post = Post::with(['user', 'comments.user', 'likes.user', 'shares.user'])
            ->withCount(['likes', 'comments', 'shares'])
            ->find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        // Check if user owns the post
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:Recipes,Organizations,Offers,Weekly Menu',
            'content' => 'sometimes|required|string',
            'lugar' => 'nullable|string|max:255',
            'tags' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $post->update($request->all());
        $post->load(['user', 'likes', 'comments', 'shares']);
        $post->loadCount(['likes', 'comments', 'shares']);

        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully',
            'data' => $post
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        // Check if user owns the post
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully'
        ]);
    }
}
