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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('diet_type', [
                'diabetes',
                'hypertension',
                'weight_loss',
                'muscle_gain',
                'vegetarian',
                'budget'
            ]);
            $table->decimal('total_calories', 10, 2);
            $table->decimal('total_cost', 10, 2);
            $table->date('week_start_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
