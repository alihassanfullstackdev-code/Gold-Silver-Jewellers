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
            $env = config('services.safepay.env'); // sandbox
            $apiKey = config('services.safepay.public_key');

            // Bypassing the "sandbox." prefix to avoid DNS resolution errors
            // Safepay handles environment via the payload
            $apiUrl = "https://api.safepay.pk/v1/tracker";

            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->post($apiUrl, [
                'client'      => $apiKey,
                'amount'      => (float)$request->total,
                'currency'    => 'PKR',
                'environment' => $env // Yahan 'sandbox' jayega
            ]);

            if (!$response->successful()) {
                Log::error('Safepay API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json()
                ]);
                return response()->json(['success' => false, 'message' => 'Safepay API Response Error'], 400);
            }

            $data = $response->json();
            $token = $data['data']['token'] ?? $data['token'] ?? null;

            if (!$token) {
                return response()->json(['success' => false, 'message' => 'Token not found in response'], 400);
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

            // Checkout URL - Agar sandbox hai toh sandbox subdomain use karein redirection ke liye
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
            Log::error('Safepay Final API Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Network Error: ' . $e->getMessage()], 500);
        }
    }
}