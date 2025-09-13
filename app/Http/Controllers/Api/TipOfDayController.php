<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipOfDay;
use Illuminate\Http\Request;

class TipOfDayController extends Controller
{
    /**
     * Get a tip of the day based on current date (consistent for the day).
     */
    public function index()
    {
        // Use today's date as seed for consistent daily tip
        $dayOfYear = date('z'); // Day of year (0-365)
        $totalTips = TipOfDay::count();
        
        if ($totalTips === 0) {
            // Return a default tip if no tips are found in the database
            return response()->json([
                'title' => 'Ahorra comprando en temporada',
                'description' => 'Las frutas y verduras de temporada pueden costar hasta 40% menos. Pregúntame qué está en temporada este mes.'
            ]);
        }
        
        // Calculate which tip to show based on day of year
        $tipIndex = $dayOfYear % $totalTips;
        $tip = TipOfDay::skip($tipIndex)->first();
        
        return response()->json($tip);
    }
}
