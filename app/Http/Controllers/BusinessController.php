<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index()
    {
        return Inertia::render('business');
    }
}
