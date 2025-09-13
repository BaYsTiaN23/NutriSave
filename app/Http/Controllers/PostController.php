<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        return Inertia::render('CreatePost');
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|in:Recipes,Organizations,Offers,Weekly Menu',
            'content' => 'required|string',
            'tags' => 'nullable|string',
            'image' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
            'tags' => $request->tags,
            'image' => $request->image
        ]);

        return redirect()->route('feed')->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post.
     */
    public function show(string $id): Response
    {
        $post = Post::with(['user', 'comments.user', 'likes.user', 'shares.user'])
            ->withCount(['likes', 'comments', 'shares'])
            ->findOrFail($id);

        return Inertia::render('PostDetail', [
            'post' => $post
        ]);
    }
}
