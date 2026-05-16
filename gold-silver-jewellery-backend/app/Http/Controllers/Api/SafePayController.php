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
            $env = config('services.safepay.env') ?? 'sandbox'; 
            $apiKey = config('services.safepay.public_key');

            $apiUrl = ($env === 'sandbox') 
                ? "https://sandbox.api.getsafepay.com/v1/tracker" 
                : "https://api.getsafepay.com/v1/tracker";

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($apiUrl, [
                'client'      => $apiKey,
                'amount'      => (float)$request->total,
                'currency'    => 'PKR',
                'environment' => $env
            ]);

            // FIXED: Agar gateway response code hit na kare (400/500/401) to direct data idhar dikhao
            if (!$response->successful()) {
                Log::error('Safepay API Failed:', [
                    'status' => $response->status(),
                    'body' => $response->json()
                ]);
                return response()->json([
                    'success' => false, 
                    'message' => 'Safepay API Failed to Response',
                    'safepay_status' => $response->status(),
                    'safepay_error' => $response->json()
                ], 400);
            }

            $data = $response->json();
            
            // FIXED: Safepay ke alag alag tracker layouts ke mutabiq token extract karne ka short-shot tarika
            $token = $data['data']['token'] ?? $data['token'] ?? $data['data']['tracker']['token'] ?? null;

            // FIXED: Agar response status 200 hai par token key parse nahi ho saki, toh raw dump dikhao
            if (!$token) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Token field missing in successful response structure',
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