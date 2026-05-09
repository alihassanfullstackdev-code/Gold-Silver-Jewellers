<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Factory use karne ki bajaye direct Create use karein
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gsj.com',
            'password' => Hash::make('GSJ123@'),
            'email_verified_at' => now(), // Optional: Agar verify email ka chakkar ho
        ]);
    }
}