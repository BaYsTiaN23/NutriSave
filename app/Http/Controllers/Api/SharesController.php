<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Share;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SharesController extends Controller
{
    /**
     * Store a newly created share.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'shared_to' => 'nullable|string|max:255'
        ]);

        $share = Share::create([
            'post_id' => $request->post_id,
            'user_id' => Auth::id(),
            'shared_to' => $request->shared_to
        ]);

        $share->load(['user', 'post']);

        return response()->json([
            'success' => true,
            'message' => 'Post shared successfully',
            'data' => $share
        ], 201);
    }
}
