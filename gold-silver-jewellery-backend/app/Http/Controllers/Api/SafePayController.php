<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Safepay\Safepay;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class SafePayController extends Controller
{
    public function createTracker(Request $request)
    {
        // 1. Validation
        $request->validate([
            'total'   => 'required|numeric',
            'name'    => 'required|string',
            'email'   => 'required|email',
            'phone'   => 'required',
            'address' => 'required|string',
            'cart'    => 'required|array',
        ]);

        try {
            // 2. SDK v1.0.0 Initialization
            // Humne teeno secret properties ko fill kiya hai taake SDK crash na kare
            $safepay = new Safepay([
                'environment'   => config('services.safepay.env'),
                'apiKey'        => config('services.safepay.public_key'),
                'vCode'         => config('services.safepay.secret_key'),
                'webhookSecret' => config('services.safepay.webhook_secret'),
                'v1Secret'      => config('services.safepay.webhook_secret'), 
            ]); 

            // 3. Payment Tracker Create Karein
            $response = $safepay->payments->create([
                'amount'   => (float)$request->total,
                'currency' => 'PKR',
            ]);

            // 4. Token Check
            $token = $response['token'] ?? null;

            if (!$token) {
                Log::error('Safepay Token Missing Response:', (array)$response);
                return response()->json(['success' => false, 'message' => 'Safepay token generate nahi ho saka'], 400);
            }

            $merchantOrderId = 'GSJ-' . time();

            // 5. Database mein Order Save Karein
            Order::create([
                'order_id'         => $merchantOrderId,
                'order_reference'  => $token, 
                'customer_name'    => $request->name,
                'customer_email'   => $request->email,
                'customer_phone'   => $request->phone,
                'customer_address' => $request->address,
                'total_amount'     => $request->total,
                'status'           => 'pending',
                'cart_details'     => json_encode($request->cart), // Array ko JSON string banaya
            ]);

            // 6. Checkout URL Build Karein
            $baseUrl = config('services.safepay.env') === 'sandbox' 
                       ? "https://sandbox.api.safepay.pk/checkout/pay" 
                       : "https://api.safepay.pk/checkout/pay";

            $checkoutUrl = $baseUrl . "?" . http_build_query([
                'beacon'       => $token,
                'pk'           => config('services.safepay.public_key'),
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
            Log::error('Safepay Final Fix Error: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'error'   => 'Technical Error: ' . $e->getMessage()
            ], 500);
        }
    }
}