<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class UserProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $userProfiles = UserProfile::with('user')->paginate(15);
        return response()->json($userProfiles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id|unique:user_profiles,user_id',
            'age' => 'nullable|integer|min:1|max:150',
            'weight' => 'nullable|numeric|min:1|max:999.99',
            'height' => 'nullable|numeric|min:1|max:999.99',
            'medical_condition' => 'nullable|array',
            'dietary_preferences' => 'nullable|array',
            'allergens' => 'nullable|array',
            'weekly_budget' => 'nullable|numeric|min:0|max:99999999.99',
            'goal' => ['required', Rule::in(['weight_loss', 'muscle_gain', 'diabetes_control', 'hypertension_control', 'balanced', 'custom'])],
        ]);

        $userProfile = UserProfile::create($validated);
        $userProfile->load('user');

        return response()->json($userProfile, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserProfile $userProfile): JsonResponse
    {
        $userProfile->load('user');
        return response()->json($userProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserProfile $userProfile): JsonResponse
    {
        $validated = $request->validate([
            'age' => 'nullable|integer|min:1|max:150',
            'weight' => 'nullable|numeric|min:1|max:999.99',
            'height' => 'nullable|numeric|min:1|max:999.99',
            'medical_condition' => 'nullable|array',
            'dietary_preferences' => 'nullable|array',
            'allergens' => 'nullable|array',
            'weekly_budget' => 'nullable|numeric|min:0|max:99999999.99',
            'goal' => ['sometimes', Rule::in(['weight_loss', 'muscle_gain', 'diabetes_control', 'hypertension_control', 'balanced', 'custom'])],
        ]);

        $userProfile->update($validated);
        $userProfile->load('user');

        return response()->json($userProfile);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserProfile $userProfile): JsonResponse
    {
        $userProfile->delete();
        return response()->json(null, 204);
    }
}
