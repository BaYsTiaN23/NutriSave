<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'comment' => 'required|string|max:1000'
        ]);

        $comment = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => Auth::id(),
            'comment' => $request->comment
        ]);

        // If it's an AJAX request, return JSON
        if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            $comment->load('user');
            return response()->json([
                'success' => true,
                'message' => 'Comment added successfully',
                'data' => $comment
            ], 201);
        }

        // Otherwise, redirect back (for normal form submissions)
        return back()->with('success', 'Comment added successfully!');
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(string $id): RedirectResponse
    {
        $comment = Comment::findOrFail($id);

        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $postId = $comment->post_id;
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }
}
