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
        // Validation same rahegi
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
            $secretKey = env('SAFEPAY_SECRET_KEY'); // Ab Secret Key chahiye Header ke liye
            
            // Ek unique tracker ID ya time-based token fake dynamic track banane ke liye
            $merchantOrderId = 'GSJ-' . time();

            // v3 API Endpoint Setup (Naya format)
            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/order/payments/v3/" . $merchantOrderId
                : "https://api.getsafepay.com/order/payments/v3/" . $merchantOrderId;

            // Nayi Docs ke mutabiq authentic payload layout
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'X-SFPY-MERCHANT-SECRET' => trim($secretKey) // Custom Secret Key Header
            ])->post($apiUrl, [
                'payload' => [
                    'payment_method' => [
                        'card' => [
                            // Abhi hum dummy testing details bhej rahe hain sandbox verification ke liye
                            'card_number'      => "5200000000001096", // Default Test Card
                            'expiration_month' => "12",
                            'expiration_year'  => "2028",
                            'cvv'              => "123"
                        ]
                    ]
                ]
            ]);

            // Agar gateway response crash ho
            if (!$response->successful()) {
                Log::error('Safepay v3 API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body()
                ]);
                return response()->json([
                    'success' => false, 
                    'message' => 'Safepay v3 API Response Error',
                    'status_received' => $response->status(),
                    'error_details' => $response->json() ?? $response->body()
                ], 400);
            }

            $data = $response->json();
            
            // Nayi Docs ke response JSON ke mutabiq token uthana: data.tracker.token
            $token = $data['data']['tracker']['token'] ?? null;

            if (!$token) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Tracker Token missing in v3 response structure',
                    'raw_safepay_response' => $data
                ], 400);
            }

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

            // Checkout redirection Base URL for v3 
            $checkoutBaseUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/checkout/pay" 
                : "https://api.getsafepay.com/checkout/pay";

            $checkoutUrl = $checkoutBaseUrl . "?" . http_build_query([
                'beacon'       => $token,
                'pk'           => env('SAFEPAY_PUBLIC_KEY'),
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
                'tracker_token'=> $token
            ]);

        } catch (\Exception $e) {
            Log::error('Safepay v3 API Exception: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Network Exception: ' . $e->getMessage()], 500);
        }
    }
}