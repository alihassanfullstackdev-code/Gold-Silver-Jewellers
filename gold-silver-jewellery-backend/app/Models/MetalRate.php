<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetalRate extends Model
{
    protected $fillable = [
        'gold_24k',
        'gold_22k',
        'gold_21k',
        'gold_18k',
        'silver',
        'platinum',
    ];
}
