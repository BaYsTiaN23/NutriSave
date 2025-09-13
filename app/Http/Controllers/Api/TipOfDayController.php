<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipOfDay;
use Illuminate\Http\Request;

class TipOfDayController extends Controller
{
    /**
     * Get a random tip of the day.
     */
    public function index()
    {
        $tip = TipOfDay::inRandomOrder()->first();
        
        if (!$tip) {
            // Return a default tip if no tips are found in the database
            return response()->json([
                'title' => 'Ahorra comprando en temporada',
                'description' => 'Las frutas y verduras de temporada pueden costar hasta 40% menos. Pregúntame qué está en temporada este mes.'
            ]);
        }
        
        return response()->json($tip);
    }
}
