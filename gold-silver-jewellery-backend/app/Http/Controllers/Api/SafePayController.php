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
            $env = config('services.safepay.env');
            $apiKey = config('services.safepay.public_key');

            // UPDATE: Naya Endpoint jo resolve hoga
            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.safepay.pk/v1/tracker" 
                : "https://api.safepay.pk/v1/tracker";

            // Direct API Call
            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->post($apiUrl, [
                'client'   => $apiKey,
                'amount'   => (float)$request->total,
                'currency' => 'PKR',
                'environment' => $env
            ]);

            // Agar domain resolve na ho ya koi aur masla ho
            if (!$response->successful()) {
                Log::error('Safepay API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json()
                ]);
                return response()->json(['success' => false, 'message' => 'Safepay API se rabta nahi ho saka'], 400);
            }

            $data = $response->json();
            // Safepay ka naya response structure aksar direct data deta hai
            $token = $data['data']['token'] ?? $data['token'] ?? null;

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

            // Checkout Page URL (Ye wahi rahega)
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
            return response()->json(['success' => false, 'error' => 'Connection Error: ' . $e->getMessage()], 500);
        }
    }
}