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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->after('order_reference');
            $table->string('customer_phone')->after('customer_email');
            $table->string('city')->after('customer_phone');
            $table->text('shipping_address')->after('city');
            $table->string('postal_code')->nullable()->after('shipping_address');
            $table->text('order_notes')->nullable()->after('postal_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_phone',
                'city',
                'shipping_address',
                'postal_code',
                'order_notes'
            ]);
        });
    }
};
