<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Rate\MetalRateController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Api\OrderController; // Imported correctly

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
Route::get('/live-rates/active', [MetalRateController::class, 'getLatestRates']);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);

// --- CONNECTED CASH ON DELIVERY & DASHBOARD ROUTES ---

// 1. Frontend API Route: Process order checkout request array
Route::post('/orders/place-cod', [OrderController::class, 'placeCodOrder']);

// 2. Admin Dashboard API Route: Fetch all orders list execution
Route::get('orders', [OrderController::class, 'getDashboardOrders']);
Route::delete('/orders/{id}', [OrderController::class, 'deleteOrder']);
// 3. Admin Dashboard API Route: Update specific execution target reference status 
Route::put('orders/{id}/status', [OrderController::class, 'updateOrderStatus']);
