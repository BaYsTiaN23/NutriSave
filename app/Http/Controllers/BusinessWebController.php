<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class BusinessWebController extends Controller
{
    /**
     * Display the business page.
     */
    public function index(): Response
    {
        return Inertia::render('business');
    }
}
