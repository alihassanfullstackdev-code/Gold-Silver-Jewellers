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
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED, AUTO_INCREMENT
            $table->string('name'); // varchar(255)
            $table->string('slug')->unique(); // varchar(255) + unique index
            $table->timestamps(); // created_at aur updated_at dono handles karta hai
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
