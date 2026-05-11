<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * React se jab user 'Checkout' par click karega.
     */
    public function initiatePayment(Request $request)
    {
        // 1. Validation
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
        ]);

        try {
            // 2. bSecure Service ko resolve karna (Dash hata di gayi hai)
            $bSecure = app('universalcheckout');

            // 3. Order Create karna
            $order = $bSecure->createOrder([
                'order_id'       => 'GSJ-' . uniqid(), 
                'total_amount'   => $request->total,
                'currency'       => 'PKR',
                'customer_email' => $request->email,
                'customer_phone' => $request->phone ?? '923030107581',
            ]);

            // 4. Checkout URL hasil karna
            $checkoutUrl = $order->getCheckoutUrl();

            return response()->json([
                'success'      => true,
                'checkout_url' => $checkoutUrl,
            ], 200);

        } catch (\Exception $e) {
            Log::error('bSecure Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment initiation failed.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * bSecure se wapas aane par status verify karna.
     */
    public function verifyPayment(Request $request)
    {
        try {
            // Service resolve karna
            $bSecure = app('universalcheckout');
            
            // Payment status check karna
            $status = $bSecure->verifyOrder($request->all());

            if ($status->isSuccess()) {
                // TODO: Aap yahan Database mein Order status update kar sakte hain
                
                return redirect('https://silvergoldjewellers.vercel.app/order-success');
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('bSecure Verification Failed: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}