<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Rate\MetalRateController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Api\OrderController; // Naya OrderController import kiya

// Connection Test Routes
Route::get('/connection-test', function () {
    return response()->json([
        'success' => true,
        'message' => 'Mubarak ho! Backend Connected.'
    ]);
});

Route::get('/', function () {
    return "Backend is Live!";
});

// Authentication Route
Route::post('/login', [AuthController::class, 'login']);

// Business/Catalog Resources
Route::apiResource('rates', MetalRateController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);

// --- NEW CASH ON DELIVERY & DASHBOARD ROUTES ---

// 1. Frontend API: User jab cart ya drawer se order place karega
Route::post('/orders/place-cod', [OrderController::class, 'placeCodOrder']);

// 2. Admin Dashboard API: Saare orders list karne ke liye
Route::get('orders', [OrderController::class, 'getDashboardOrders']);

// 3. Admin Dashboard API: Kisi order ka status (pending/completed/failed) change karne ke liye
Route::put('orders/{id}/status', [OrderController::class, 'updateOrderStatus']);
