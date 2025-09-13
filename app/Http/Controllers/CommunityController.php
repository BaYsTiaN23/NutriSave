<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    /**
     * Display the community page.
     */
    public function index(): Response
    {
        return Inertia::render('community');
    }
}

