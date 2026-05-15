<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // SDK ki jagah Http Client use karenge
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class SafePayController extends Controller
{
    public function createTracker(Request $request)
    {
        $request->validate([
            'total'   => 'required|numeric',
            'name'    => 'required|string',
            'email'   => 'required|email',
            'phone'   => 'required',
            'address' => 'required|string',
            'cart'    => 'required|array',
        ]);

        try {
            // Setup keys and URL
            $env = config('services.safepay.env');
            $apiKey = config('services.safepay.public_key');
            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.safepay.pk/order/v1/init" 
                : "https://api.safepay.pk/order/v1/init";

            // Direct API Call (Standard Method)
            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->post($apiUrl, [
                'client'   => $apiKey,
                'amount'   => (float)$request->total,
                'currency' => 'PKR',
                'environment' => $env
            ]);

            if (!$response->successful()) {
                Log::error('Safepay API Failed:', $response->json());
                return response()->json(['success' => false, 'message' => 'Safepay connection failed'], 400);
            }

            $data = $response->json();
            $token = $data['data']['token'] ?? null;

            if (!$token) {
                return response()->json(['success' => false, 'message' => 'Token generation failed'], 400);
            }

            $merchantOrderId = 'GSJ-' . time();

            // Order Save Karein
            Order::create([
                'order_id'         => $merchantOrderId,
                'order_reference'  => $token, 
                'customer_name'    => $request->name,
                'customer_email'   => $request->email,
                'customer_phone'   => $request->phone,
                'customer_address' => $request->address,
                'total_amount'     => $request->total,
                'status'           => 'pending',
                'cart_details'     => json_encode($request->cart),
            ]);

            // Checkout Page URL
            $checkoutBaseUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.safepay.pk/checkout/pay" 
                : "https://api.safepay.pk/checkout/pay";

            $checkoutUrl = $checkoutBaseUrl . "?" . http_build_query([
                'beacon'       => $token,
                'pk'           => $apiKey,
                'amount'       => $request->total,
                'currency'     => 'PKR',
                'track'        => $merchantOrderId,
                'source'       => 'custom',
                'cancel_url'   => 'https://silvergoldjewellers.vercel.app/cart',
                'redirect_url' => 'https://silvergoldjewellers.vercel.app/order-success',
            ]);

            return response()->json([
                'success'      => true,
                'checkout_url' => $checkoutUrl,
            ]);

        } catch (\Exception $e) {
            Log::error('Safepay Direct API Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}