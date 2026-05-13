<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Check karein agar column pehle se nahi hai tabhi add karein
            if (!Schema::hasColumn('orders', 'order_reference')) {
                $table->string('order_reference')->nullable()->after('order_id');
            }
            if (!Schema::hasColumn('orders', 'cart_details')) {
                $table->json('cart_details')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['order_reference', 'cart_details']);
        });
    }
};