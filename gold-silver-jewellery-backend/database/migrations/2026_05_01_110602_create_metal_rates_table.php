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
        Schema::create('metal_rates', function (Blueprint $table) {
            $table->id();
            // Gold Types
            $table->decimal('gold_24k', 12, 2); // Pure Gold
            $table->decimal('gold_22k', 12, 2); // Pakistani standard jewelry
            $table->decimal('gold_21k', 12, 2); // Middle East standard
            $table->decimal('gold_18k', 12, 2); // Diamond jewelry setting standard

            // Silver Type
            $table->decimal('silver', 12, 2);   // Silver (Chandi)

            // Optional: Platinum (Agar aap bechte hain)
            $table->decimal('platinum', 12, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metal_rates');
    }
};
