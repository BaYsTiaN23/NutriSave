<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserProfile>
 */
class UserProfileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $medicalConditions = [
            'diabetes',
            'hypertension',
            'heart_disease',
            'kidney_disease',
            'liver_disease',
            'celiac_disease',
            'thyroid_disorder',
        ];

        $dietaryPreferences = [
            'vegetarian',
            'vegan',
            'gluten_free',
            'dairy_free',
            'low_sodium',
            'low_sugar',
            'high_protein',
            'mediterranean',
            'keto',
        ];

        $allergens = [
            'nuts',
            'shellfish',
            'fish',
            'eggs',
            'dairy',
            'soy',
            'wheat',
            'sesame',
        ];

        return [
            'user_id' => User::factory(),
            'age' => $this->faker->numberBetween(18, 80),
            'weight' => $this->faker->randomFloat(2, 40, 150),
            'height' => $this->faker->randomFloat(2, 140, 200),
            'medical_condition' => $this->faker->randomElements($medicalConditions, $this->faker->numberBetween(0, 3)),
            'dietary_preferences' => $this->faker->randomElements($dietaryPreferences, $this->faker->numberBetween(0, 4)),
            'allergens' => $this->faker->randomElements($allergens, $this->faker->numberBetween(0, 3)),
            'weekly_budget' => $this->faker->randomFloat(2, 50, 500),
            'goal' => $this->faker->randomElement([
                'weight_loss',
                'muscle_gain',
                'diabetes_control',
                'hypertension_control',
                'balanced',
                'custom'
            ]),
        ];
    }
}
