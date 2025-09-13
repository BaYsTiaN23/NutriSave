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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('billing_plans')->onDelete('restrict');
            $table->enum('status', ['active', 'cancelled', 'expired'])->default('active');
            $table->date('start_date');
            $table->date('next_payment_date')->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['business_id', 'status']);
            $table->index(['plan_id']);
            $table->index(['next_payment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
