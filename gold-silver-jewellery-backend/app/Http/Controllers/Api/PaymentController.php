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
        // Strict Validation
        $request->validate([
            'total' => 'required',
            'email' => 'required|email',
            'cart'  => 'required|array', 
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time();
            $orderSDK->setOrderId($merchantOrderId);

            $customer = [
                "name"         => $request->name ?? "Valued Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "923001234567",
            ];
            $orderSDK->setCustomer($customer);

            $products = [];
            foreach ($request->cart as $item) {
                // Handling multiple possible key names from frontend
                $price = $item['fixed_price'] ?? $item['price'] ?? 0;
                $making = $item['making_charges'] ?? $item['making'] ?? 0;
                $quantity = (int)($item['quantity'] ?? 1);
                
                $unitPrice = (float)$price + (float)$making;

                // Image handling
                $img = $item['image'] ?? '';
                $imageUrl = filter_var($img, FILTER_VALIDATE_URL) 
                            ? $img 
                            : "https://gold-silver-jewellers-production.up.railway.app/storage/" . $img;

                $products[] = [
                    "id"                => (string)($item['id'] ?? rand(100, 999)),
                    "name"              => (string)($item['name'] ?? "Jewelry Item"),
                    "sku"               => "GSJ-" . ($item['id'] ?? rand(1, 50)),
                    "quantity"          => $quantity,
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "discount"          => 0,
                    "image"             => $imageUrl,
                    "description"       => ($item['name'] ?? "Jewelry") . " - Premium Selection",
                    "short_description" => "Handcrafted Jewelry" // Required field
                ];
            }
            
            $orderSDK->setCartItems($products);
            $result = $orderSDK->createOrder();

            if (isset($result['body']['checkout_url'])) {
                // Database Entry
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
                    'checkout_url' => $result['body']['checkout_url'],
                    'order_ref'    => $result['body']['order_reference'] ?? null
                ], 200);
            }

            return response()->json(['success' => false, 'details' => $result], 400);

        } catch (\Exception $e) {
            Log::error('bSecure Error Trace: ' . $e->getMessage());
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