<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    /**
     * Saare columns jo database mein hain unhein yahan fillable mein likhna lazmi hai
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'metal_type',
        'karat',
        'weight_grams',
        'fixed_price',
        'making_charges',
        'is_new_arrival',
        'is_top_seller',
        'is_featured',
        'in_stock',
        'image'
    ];

    /**
     * Frontend par boolean values (0/1) ko true/false mein convert karne ke liye
     */
    protected $casts = [
        'is_new_arrival' => 'boolean',
        'is_top_seller' => 'boolean',
        'is_featured' => 'boolean',
        'in_stock' => 'boolean',
        'weight_grams' => 'decimal:3',
        'fixed_price' => 'decimal:2',
        'making_charges' => 'decimal:2',
    ];

    /**
     * Jab bhi naya product banayen, name se slug khud bakhud generate ho jaye
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Relationship: Aik product hamesha kisi aik category se talluq rakhta hai
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return asset('images/placeholder.png'); // Placeholder image agar real image na ho
    }

    /**
     * Frontend par 'image_url' bhi bhejne ke liye:
     */
    protected $appends = ['image_url'];
}
