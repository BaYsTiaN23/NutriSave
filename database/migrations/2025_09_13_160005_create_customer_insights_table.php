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
        Schema::create('customer_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->string('demographic');
            $table->integer('percentage');
            $table->decimal('avg_spend', 10, 2);
            $table->json('top_products');
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['business_id']);
            $table->index(['demographic']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_insights');
    }
};
