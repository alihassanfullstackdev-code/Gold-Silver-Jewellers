<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
// Hum facade ke bajaye direct service use karenge niche

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
        ]);

        try {
            // "universal-checkout" class ko manually resolve karna (Error fix karne ke liye)
            $bSecure = app('universal-checkout');

            $order = $bSecure->createOrder([
                'order_id'       => 'GSJ-' . uniqid(),
                'total_amount'   => $request->total,
                'currency'       => 'PKR',
                'customer_email' => $request->email,
                'customer_phone' => $request->phone ?? '923030107581',
            ]);

            return response()->json([
                'success'      => true,
                'checkout_url' => $order->getCheckoutUrl(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('bSecure Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Target class error fix trial',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        try {
            $bSecure = app('universal-checkout');
            $status = $bSecure->verifyOrder($request->all());

            if ($status->isSuccess()) {
                return redirect('https://silvergoldjewellers.vercel.app/order-success');
            }
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        } catch (\Exception $e) {
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}
