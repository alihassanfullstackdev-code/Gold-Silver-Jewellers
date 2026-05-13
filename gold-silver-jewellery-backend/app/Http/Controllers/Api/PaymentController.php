<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;
use App\Models\Order;

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
            'cart'  => 'required|array', 
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time();
            $orderSDK->setOrderId($merchantOrderId);

            // Customer Data
            $customer = [
                "name"         => $request->name ?? "Valued Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $orderSDK->setCustomer($customer);

            // Products Mapping with Safety
            $products = [];
            foreach ($request->cart as $item) {
                $price = floatval($item['fixed_price'] ?? $item['price'] ?? 0);
                $making = floatval($item['making_charges'] ?? 0);
                $unitPrice = $price + $making;

                $products[] = [
                    "id"                => (string)($item['id'] ?? rand(100, 999)),
                    "name"              => (string)($item['name'] ?? "Jewelry"),
                    "sku"               => "GSJ-" . ($item['id'] ?? rand(1, 100)),
                    "quantity"          => (int)($item['quantity'] ?? 1),
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "discount"          => 0,
                    "image"             => $item['image'] ?? "https://via.placeholder.com/150",
                    "description"       => "Premium Collection",
                    "short_description" => "SilverGold Jewelry"
                ];
            }
            
            $orderSDK->setCartItems($products);
            $result = $orderSDK->createOrder();

            // --- REDIRECTION FIX ---
            // Naya SDK checkout_url 'body' key ke andar bhejta hai
            if (isset($result['body']['checkout_url'])) {
                
                // Save to Database
                Order::create([
                    'order_id'        => $merchantOrderId,
                    'order_reference' => $result['body']['order_reference'] ?? null,
                    'customer_email'  => $request->email,
                    'total_amount'    => $request->total,
                    'status'          => 'pending',
                    'cart_details'    => $request->cart,
                ]);

                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['body']['checkout_url'], // Correct path
                ], 200);
            }

            // Authentication Failed ya koi aur error yahan details mein show hoga
            return response()->json([
                'success' => false,
                'message' => 'bSecure Error',
                'details' => $result 
            ], 400);

        } catch (\Exception $e) {
            Log::error('bSecure Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        try {
            $order_ref = $request->query('order_ref');
            if (!$order_ref) return redirect('https://silvergoldjewellers.vercel.app/order-failed');

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);
            $localOrder = Order::where('order_reference', $order_ref)->first();

            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                if ($localOrder) $localOrder->update(['status' => 'completed']);
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            if ($localOrder) $localOrder->update(['status' => 'failed']);
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('Verification Error: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}