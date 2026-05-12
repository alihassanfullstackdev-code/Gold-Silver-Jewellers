<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;
use App\Models\Order; // Model Import karein

class PaymentController extends Controller
{
    /**
     * bSecure Checkout Initiate & Save to DB
     */
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
            'cart'  => 'required|array', 
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time(); // Unique ID for your DB
            $orderSDK->setOrderId($merchantOrderId);

            // Customer Details
            $customer = [
                "name"         => $request->name ?? "Valued Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "923001234567",
            ];
            $orderSDK->setCustomer($customer);

            // Products Mapping
            $products = [];
            foreach ($request->cart as $item) {
                $img = $item['image'] ?? '';
                $imageUrl = filter_var($img, FILTER_VALIDATE_URL) 
                            ? $img 
                            : "https://gold-silver-jewellers-production.up.railway.app/storage/" . $img;

                $unitPrice = (float)($item['fixed_price'] ?? 0) + (float)($item['making_charges'] ?? 0);

                $products[] = [
                    "id"                => (string)($item['id'] ?? rand(100, 999)),
                    "name"              => $item['name'] ?? "Jewelry Item",
                    "sku"               => "GSJ-" . ($item['id'] ?? rand(1, 50)),
                    "quantity"          => (int)($item['quantity'] ?? 1),
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "image"             => $imageUrl,
                    "description"       => ($item['name'] ?? "Jewelry") . " - Premium Selection",
                    "short_description" => "Handcrafted Jewelry"
                ];
            }
            
            $orderSDK->setCartItems($products);
            $result = $orderSDK->createOrder();

            if (isset($result['body']['checkout_url'])) {
                
                // --- DATABASE SAVING START ---
                Order::create([
                    'order_id'        => $merchantOrderId,
                    'order_reference' => $result['body']['order_reference'] ?? null,
                    'customer_email'  => $request->email,
                    'total_amount'    => $request->total,
                    'status'          => 'pending',
                    'cart_details'    => $request->cart, // JSON casting model handle karega
                ]);
                // --- DATABASE SAVING END ---

                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['body']['checkout_url'],
                    'order_ref'    => $result['body']['order_reference'] ?? null
                ], 200);
            }

            return response()->json(['success' => false, 'details' => $result], 400);

        } catch (\Exception $e) {
            Log::error('bSecure Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Payment Verification & Update DB Status
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

            // Database mein order dhoondein
            $localOrder = Order::where('order_reference', $order_ref)->first();

            if (isset($result['body']['placement_status']) && $result['body']['placement_status'] == "3") {
                
                // Database status update
                if ($localOrder) {
                    $localOrder->update(['status' => 'completed']);
                }

                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            // Agar status fail hua to
            if ($localOrder) {
                $localOrder->update(['status' => 'failed']);
            }

            return redirect('https://silvergoldjewellers.vercel.app/order-failed');

        } catch (\Exception $e) {
            Log::error('Verification Error: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed');
        }
    }
}