<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        // 1. Validation
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
        ]);

        try {
            $order = new BsecureCheckout();

            // 2. Set Unique Order ID
            $order->setOrderId('GSJ-' . time());

            // 3. Set Customer Details
            $customer = [
                "name"         => $request->name ?? "Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $order->setCustomer($customer);

            // 4. Set Cart Items (Missing keys added to avoid Undefined Array Key error)
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
                    "short_description" => "Jewelry purchase" // Fixed: Added missing key
                ]
            ];
            $order->setCartItems($products);

            // 5. Optional: Set Callback URL explicitly if needed
            // $order->setCallbackUrl(env('BSECURE_RETURN_URL'));

            // 6. Create Order
            $result = $order->createOrder();

            // 7. Handle Response
            if (!empty($result['checkout_url'])) {
                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['checkout_url'],
                    'order_ref'    => $result['order_reference'] ?? null
                ], 200);
            }

            // Return full result if bSecure sends an error message
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

    public function verifyPayment(Request $request)
    {
        try {
            $order_ref = $request->query('order_ref');
            
            if (!$order_ref) {
                return redirect('https://silvergoldjewellers.vercel.app/order-failed');
            }

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            // Check placement_status in the body response
            // Status 3 = Placed/Completed
            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                return redirect('https://silvergoldjewellers.vercel.app/order-success');
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('Verification Error: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}