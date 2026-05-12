<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['order_id', 'order_reference', 'customer_email', 'total_amount', 'status', 'cart_details'];
    protected $casts = ['cart_details' => 'array'];
}
