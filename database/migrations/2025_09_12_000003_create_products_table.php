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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('category', [
                'fruit',
                'protein',
                'cereal',
                'vegetable',
                'dairy',
                'other'
            ]);
            $table->string('unit');
            $table->decimal('price_per_unit', 10, 2);
            $table->boolean('stock_available')->default(true);
            $table->jsonb('nutrition_info')->nullable();
            $table->string('barcode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
