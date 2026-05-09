<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Final CORS Configuration (Fixed & Strict)
    |--------------------------------------------------------------------------
    */

    // Saare routes allow kar diye hain taake kisi bhi path par error na aaye
    'paths' => ['*', 'api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Production Domains
        'https://gold-silver-jewellers.vercel.app',
        // 'https://gold-silver-jewellers-production.up.railway.app',
        
        // Localhost Domains (As per your request)
        // 'http://localhost:3000',
        // 'http://localhost:5173', 
        // 'http://127.0.0.1:3000',
        // 'http://127.0.0.1:5173',
        // 'http://localhost:8000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ISAY TRUE RAKHEIN: Yeh login sessions aur auth tokens ke liye zaroori hai
    'supports_credentials' => true,

];