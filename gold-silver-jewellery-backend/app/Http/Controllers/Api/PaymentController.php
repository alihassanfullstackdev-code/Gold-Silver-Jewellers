<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;

class PaymentController extends Controller
{
    /**
     * bSecure Checkout Initiate Karein
     */
    public function initiatePayment(Request $request)
    {
        // 1. Validation
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
        ]);

        try {
            $order = new BsecureCheckout();

            // 2. Unique Order ID (GSJ prefix ke sath)
            $order->setOrderId('GSJ-' . time());

            // 3. Customer Details
            $customer = [
                "name"         => $request->name ?? "Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $order->setCustomer($customer);

            // 4. Cart Items (Required fields for bSecure SDK)
            $products = [
                [
                    "id"                => "1",
                    "name"              => "Jewelry Item",
                    "sku"               => "GSJ-001",
                    "quantity"          => 1,
                    "price"             => $request->total,
                    "sale_price"        => $request->total,
                    "image"             => "https://via.placeholder.com/150", 
                    "description"       => "Jewelry purchase from SilverGold&Jewellers",
                    "short_description" => "Jewelry purchase" 
                ]
            ];
            $order->setCartItems($products);

            // 5. Create Order via bSecure API
            $result = $order->createOrder();

            // 6. Response Handling (Updated IF condition for bSecure body structure)
            if (isset($result['body']['checkout_url'])) {
                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['body']['checkout_url'],
                    'order_ref'    => $result['body']['order_reference'] ?? null
                ], 200);
            }

            // Agar bSecure koi error bhejta hai
            return response()->json([
                'success' => false,
                'message' => 'bSecure API Error',
                'details' => $result 
            ], 400);

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
     * bSecure se wapis aane par payment verify karein
     */
    public function verifyPayment(Request $request)
    {
        try {
            // bSecure query string mein 'order_ref' bhejta hai
            $order_ref = $request->query('order_ref');
            
            if (!$order_ref) {
                Log::warning('Payment verification failed: No order_ref provided.');
                return redirect('https://silvergoldjewellers.vercel.app/order-failed');
            }

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            // Check placement_status: 3 means "Placed/Success"
            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('Verification Exception: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}