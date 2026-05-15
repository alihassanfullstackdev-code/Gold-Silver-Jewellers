<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use bSecure\UniversalCheckout\BsecureCheckout;
use App\Models\Order;

class PaymentController extends Controller
{
    /**
     * bSecure Checkout Initiate
     */
    public function initiatePayment(Request $request)
    {
        // Validation mein naye fields lazmi karein
        $request->validate([
            'total'   => 'required|numeric',
            'email'   => 'required|email',
            'name'    => 'required|string',
            'phone'   => 'required',
            'address' => 'required',
            'cart'    => 'required|array',
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time();
            $orderSDK->setOrderId($merchantOrderId);

            // bSecure ko asli data bhejien
            $customer = [
                "name"         => $request->name,
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone,
                "address"      => $request->address,
            ];
            $orderSDK->setCustomer($customer);

            $products = [];
            foreach ($request->cart as $item) {
                $price = floatval($item['fixed_price'] ?? $item['price'] ?? 0);
                $making = floatval($item['making_charges'] ?? 0);
                $unitPrice = $price + $making;

                $products[] = [
                    "id"                => (string)($item['id']),
                    "name"              => (string)($item['name']),
                    "sku"               => "GSJ-" . ($item['id']),
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

            if (isset($result['body']['checkout_url'])) {
                // --- FIXED AREA: Database mein saara data bhejien ---
                Order::create([
                    'order_id'         => $merchantOrderId,
                    'order_reference'  => $result['body']['order_reference'] ?? null,
                    'customer_name'    => $request->name,    // Pehle ye missing tha
                    'customer_email'   => $request->email,
                    'customer_phone'   => $request->phone,   // Pehle ye missing tha
                    'customer_address' => $request->address, // Pehle ye missing tha
                    'total_amount'     => $request->total,
                    'status'           => 'pending',
                    'cart_details'     => $request->cart,
                ]);

                return response()->json([
                    'success'      => true,
                    'checkout_url' => $result['body']['checkout_url'],
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'bSecure API Error',
                'details' => $result
            ], 400);
        } catch (\Exception $e) {
            Log::error('bSecure Initiate Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * bSecure Callback/Verification
     */
    public function verifyPayment(Request $request)
    {
        try {
            $order_ref = $request->query('order_ref') ?? $request->query('order_reference');

            if (!$order_ref) {
                return redirect('https://silvergoldjewellers.vercel.app/order-failed?error=no_ref');
            }

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            $localOrder = Order::where('order_reference', $order_ref)->first();
            $status = $result['body']['placement_status'] ?? null;

            if ($status == "3" || $status == 3) {
                if ($localOrder) {
                    $localOrder->update(['status' => 'completed']);
                }
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            if ($localOrder) {
                $localOrder->update(['status' => 'failed']);
            }
            return redirect('https://silvergoldjewellers.vercel.app/order-failed?ref=' . $order_ref);
        } catch (\Exception $e) {
            Log::error('Verification Crash: ' . $e->getMessage());
            return redirect('https://silvergoldjewellers.vercel.app/order-failed?error=exception');
        }
    }
}