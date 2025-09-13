<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('age')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->jsonb('medical_condition')->nullable();
            $table->jsonb('dietary_preferences')->nullable();
            $table->jsonb('allergens')->nullable();
            $table->decimal('weekly_budget', 10, 2)->nullable();
            $table->enum('goal', [
                'weight_loss',
                'muscle_gain',
                'diabetes_control',
                'hypertension_control',
                'balanced',
                'custom'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
