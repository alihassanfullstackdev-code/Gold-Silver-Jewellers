<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'metal_type',
        'karat', 'weight_grams', 'fixed_price', 'making_charges',
        'is_new_arrival', 'is_top_seller', 'is_featured', 'in_stock', 'image'
    ];

    protected $casts = [
        'is_new_arrival' => 'boolean',
        'is_top_seller' => 'boolean',
        'is_featured' => 'boolean',
        'in_stock' => 'boolean',
        'weight_grams' => 'decimal:3',
        'fixed_price' => 'decimal:2',
        'making_charges' => 'decimal:2',
    ];

    protected $appends = ['image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute()
    {
        // Railway par images ke liye hamesha absolute URL bhejna behtar hai
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return 'https://via.placeholder.com/400x400?text=No+Image';
    }
}