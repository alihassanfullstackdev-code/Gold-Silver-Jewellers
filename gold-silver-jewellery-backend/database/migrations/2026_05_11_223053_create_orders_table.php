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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Merchant Order ID (GSJ-123...)
            $table->string('order_reference')->nullable(); // bSecure ka reference code
            $table->string('customer_email');
            $table->decimal('total_amount', 12, 2);
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->json('cart_details')->nullable(); // Pura items ka data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
