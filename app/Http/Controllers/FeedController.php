<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    /**
     * Display the feed page with posts.
     */
    public function index(Request $request): Response
    {
        $posts = Post::with(['user', 'likes', 'comments', 'shares'])
            ->withCount(['likes', 'comments', 'shares'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Feed', [
            'posts' => $posts
        ]);
    }
}
