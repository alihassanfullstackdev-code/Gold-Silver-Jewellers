<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Sahi Facade path jo aapki composer.lock mein hai
use bSecure\UniversalCheckout\CheckoutFacade as bSecure; 
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
            // 2. bSecure Order Object create karna
            // Note: Is library mein createOrder method isi tarah variables leta hai
            $order = bSecure::createOrder([
                'order_id'       => 'GSJ-' . uniqid(), 
                'total_amount'   => $request->total,
                'currency'       => 'PKR',
                'customer_email' => $request->email,
                'customer_phone' => $request->phone ?? '923030107581',
            ]);

            // 3. Checkout URL hasil karna
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
            // bSecure data bhejta hai, hum verifyOrder use karenge
            $status = bSecure::verifyOrder($request->all());

            // Status check karne ka sahi tariqa library ke mutabiq
            if ($status->isSuccess()) {
                // TODO: Database update: Order mark as Paid
                
                return redirect('https://silvergoldjewellers.vercel.app/order-success');
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('bSecure Verification Failed: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}