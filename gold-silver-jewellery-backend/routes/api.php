<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Rate\MetalRateController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Product\ProductController;

// Ensure ye line wahan mojud ho
Route::get('/connection-test', function () {
    return response()->json([
        'success' => true,
        'message' => 'Mubarak ho! Backend Connected.'
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('rates', MetalRateController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);