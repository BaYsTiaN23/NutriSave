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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('business_products')->onDelete('cascade');
            $table->decimal('discount_percentage', 5, 2);
            $table->enum('target_audience', ['families', 'young_adults', 'seniors', 'students', 'all'])->default('all');
            $table->decimal('daily_budget', 10, 2);
            $table->text('description');
            $table->enum('status', ['active', 'paused'])->default('active');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['business_id', 'status']);
            $table->index(['product_id']);
            $table->index(['target_audience']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
