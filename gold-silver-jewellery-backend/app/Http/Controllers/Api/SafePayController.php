<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
            $env = env('SAFEPAY_ENVIRONMENT', 'sandbox'); 
            $apiKey = env('SAFEPAY_PUBLIC_KEY');

            // Standard Active API Endpoint jo getsafepay.com par active hai
            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/order/v1/init" 
                : "https://api.getsafepay.com/order/v1/init";

            // Safepay standard payload structure
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($apiUrl, [
                'client'      => trim($apiKey),
                'amount'      => (float)$request->total,
                'currency'    => 'PKR',
                'environment' => trim($env)
            ]);

            if (!$response->successful()) {
                Log::error('Safepay Standard API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body()
                ]);
                return response()->json([
                    'success' => false, 
                    'message' => 'Safepay Standard API Response Error',
                    'status_received' => $response->status(),
                    'error_details' => $response->json() ?? $response->body()
                ], 400);
            }

            $data = $response->json();
            
            // Standard tracking token extract karne ka tree
            $token = $data['data']['token'] ?? $data['token'] ?? null;

            if (!$token) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Token field missing in standard response structure',
                    'raw_safepay_response' => $data
                ], 400);
            }

            $merchantOrderId = 'GSJ-' . time();

            // Database Entry
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

            // Checkout redirection URL
            $checkoutBaseUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/checkout/pay" 
                : "https://api.getsafepay.com/checkout/pay";

            // FIXED: 'env' aur 'environment' parameters ko redirect URL string mein inject kar diya hai
            $checkoutUrl = $checkoutBaseUrl . "?" . http_build_query([
                'beacon'       => $token,
                'pk'           => $apiKey,
                'amount'       => $request->total,
                'currency'     => 'PKR',
                'track'        => $merchantOrderId,
                'source'       => 'custom',
                'env'          => trim($env),
                'environment'  => trim($env),
                'cancel_url'   => 'https://silvergoldjewellers.vercel.app/cart',
                'redirect_url' => 'https://silvergoldjewellers.vercel.app/order-success',
            ]);

            return response()->json([
                'success'      => true,
                'checkout_url' => $checkoutUrl,
            ]);

        } catch (\Exception $e) {
            Log::error('Safepay API Exception: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Network Exception: ' . $e->getMessage()], 500);
        }
    }
}