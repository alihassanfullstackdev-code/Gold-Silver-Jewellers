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

            // Foreign key for category (Must be created before this table)
            // onDelete('cascade') means if category is deleted, products are also deleted.
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Metal Types as per your Enum requirement
            $table->enum('metal_type', ['gold', 'silver', 'artificial', 'platinum']);

            // Technical details for Jewelry
            $table->integer('karat')->nullable(); // e.g., 22, 21, 18
            $table->decimal('weight_grams', 10, 3)->nullable(); // Up to 3 decimal places for precision

            // Pricing details
            $table->decimal('fixed_price', 15, 2)->nullable();
            $table->decimal('making_charges', 15, 2)->default(0.00)->nullable();

            // Boolean Flags (Status)
            $table->boolean('is_new_arrival')->default(false)->nullable();
            $table->boolean('is_top_seller')->default(false)->nullable();
            $table->boolean('is_featured')->default(false)->nullable();
            $table->boolean('in_stock')->default(true)->nullable();

            // Product Asset
            $table->string('image');

            $table->timestamps(); // create_at and updated_at
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
