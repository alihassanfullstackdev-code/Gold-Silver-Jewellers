<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
// Documentation ke mutabiq sahi class path
use bSecure\UniversalCheckout\BsecureCheckout; 

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
        ]);

        try {
            // 1. Naya object banayein (Documentation method)
            $order = new BsecureCheckout();

            // 2. Data set karein (Setter methods jo doc mein hain)
            $order->setOrderId('GSJ-' . uniqid());
            
            $customer = [
                "name" => "Customer", // Aap request se le sakte hain
                "email" => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $order->setCustomer($customer);

            // Products (Empty array bhej sakte hain agar simple checkout hai)
            $order->setCartItems([]); 

            // 3. Order Create karein
            $result = $order->createOrder();

            // Documentation ke mutabiq result aik array hoga
            if(!empty($result['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'checkout_url' => $result['checkout_url'],
                    'order_ref' => $result['order_reference'] ?? null
                ], 200);
            }

            return response()->json(['success' => false, 'message' => 'Checkout URL not found'], 500);

        } catch (\Exception $e) {
            Log::error('bSecure Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment initiation failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        try {
            // Documentation ke mutabiq status check karne ka tariqa
            $order_ref = $request->query('order_ref');
            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            // Check if status is placed (ID 3 as per your doc)
            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                return redirect('https://silvergoldjewellers.vercel.app/order-success');
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}