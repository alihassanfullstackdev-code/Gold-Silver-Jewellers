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
            // DIRECT ENV SE UTHTE HAIN - NO LARAVEL CONFIG ISSUES
            $env = env('SAFEPAY_ENVIRONMENT', 'sandbox'); 
            $apiKey = env('SAFEPAY_PUBLIC_KEY');

            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/v1/tracker" 
                : "https://api.getsafepay.com/v1/tracker";

            // STRICT JSON PAYLOAD FOR SAFEPAY
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($apiUrl, [
                'client'      => trim($apiKey),
                'amount'      => (int)$request->total, // Safepay integration baaz dafa integer pasand karti hai
                'currency'    => 'PKR',
                'environment' => trim($env)
            ]);

            // Agar response 200 na ho (400/500/401)
            if (!$response->successful()) {
                Log::error('Safepay API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body()
                ]);
                return response()->json([
                    'success' => false, 
                    'message' => 'Safepay API Failed to Respond',
                    'safepay_status' => $response->status(),
                    'safepay_error_raw' => $response->body() // Raw text dikhane ke liye agar JSON null ho
                ], 400);
            }

            // Agar response successful (200) hai par body khali ho
            $rawBody = $response->body();
            $data = $response->json();

            if (empty($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Safepay returned an empty body with 200 OK status.',
                    'raw_body_received' => $rawBody,
                    'debug_key_used' => substr($apiKey, 0, 10) . '...' // Sirf verify karne ke liye ke key empty to nahi ja rahi
                ], 400);
            }
            
            $token = $data['data']['token'] ?? $data['token'] ?? $data['data']['tracker']['token'] ?? null;

            if (!$token) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Token field missing in structured response',
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

            $checkoutBaseUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/checkout/pay" 
                : "https://api.getsafepay.com/checkout/pay";

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
            Log::error('Safepay Final API Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Network Error: ' . $e->getMessage()], 500);
        }
    }
}