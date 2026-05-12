<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;

class PaymentController extends Controller
{
    /**
     * bSecure Checkout Initiate
     */
    public function initiatePayment(Request $request)
    {
        // 1. Validation
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
            'cart'  => 'required|array', 
        ]);

        try {
            $order = new BsecureCheckout();

            // 2. Unique Order ID
            $order->setOrderId('GSJ-' . time());

            // 3. Customer Details
            $customer = [
                "name"         => $request->name ?? "Valued Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "923001234567",
            ];
            $order->setCustomer($customer);

            // 4. Robust Cart Items Mapping
            $products = [];
            foreach ($request->cart as $item) {
                
                // Image URL Logic
                $img = $item['image'] ?? '';
                if (!empty($img) && !filter_var($img, FILTER_VALIDATE_URL)) {
                    $imageUrl = "https://gold-silver-jewellers-production.up.railway.app/storage/" . $img;
                } else {
                    $imageUrl = !empty($img) ? $img : "https://via.placeholder.com/150";
                }

                // Price Calculation with Null Safety to avoid "Undefined Array Key"
                $fixedPrice = (float)($item['fixed_price'] ?? 0);
                $makingCharges = (float)($item['making_charges'] ?? 0);
                $quantity = (int)($item['quantity'] ?? 1);
                $unitPrice = $fixedPrice + $makingCharges;

                // Har key ko explicitly define kiya hai jo bSecure mangta hai
                $products[] = [
                    "id"                => (string)($item['id'] ?? rand(100, 999)),
                    "name"              => $item['name'] ?? "Jewelry Item",
                    "sku"               => "GSJ-" . ($item['id'] ?? rand(1, 50)),
                    "quantity"          => $quantity,
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "image"             => $imageUrl,
                    "description"       => ($item['name'] ?? "Jewelry") . " - Premium Selection",
                    "short_description" => "Handcrafted Jewelry" // Fixed: SDK strictly requires this
                ];
            }
            
            $order->setCartItems($products);

            // 5. Create Order
            $result = $order->createOrder();

            // 6. Handle Response based on bSecure's Body Structure
            if (isset($result['body']['checkout_url'])) {
                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['body']['checkout_url'],
                    'order_ref'    => $result['body']['order_reference'] ?? null
                ], 200);
            }

            // Error Case
            return response()->json([
                'success' => false,
                'message' => 'bSecure API Error',
                'details' => $result 
            ], 400);

        } catch (\Exception $e) {
            Log::error('bSecure Error Trace: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error in Payment Initiation',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Payment Verification Callback
     */
    public function verifyPayment(Request $request)
    {
        try {
            $order_ref = $request->query('order_ref');
            
            if (!$order_ref) {
                return redirect('https://silvergoldjewellers.vercel.app/order-failed');
            }

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            // Status 3 is typically "Order Placed/Successful"
            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('Verification Error: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}