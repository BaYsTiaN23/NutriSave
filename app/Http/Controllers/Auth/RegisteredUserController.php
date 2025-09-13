<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // User profile validation
            'age' => 'nullable|integer|min:1|max:120',
            'weight' => 'nullable|numeric|min:0.1|max:999.99',
            'height' => 'nullable|numeric|min:0.1|max:999.99',
            'medical_condition' => 'nullable|array',
            'dietary_preferences' => 'nullable|array',
            'allergens' => 'nullable|array',
            'weekly_budget' => 'nullable|numeric|min:0|max:99999999.99',
            'goal' => 'required|in:weight_loss,muscle_gain,diabetes_control,hypertension_control,balanced,custom',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Create user profile
            UserProfile::create([
                'user_id' => $user->id,
                'age' => $request->age,
                'weight' => $request->weight,
                'height' => $request->height,
                'medical_condition' => $request->medical_condition,
                'dietary_preferences' => $request->dietary_preferences,
                'allergens' => $request->allergens,
                'weekly_budget' => $request->weekly_budget,
                'goal' => $request->goal,
            ]);

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return to_route('home');
    }
}
