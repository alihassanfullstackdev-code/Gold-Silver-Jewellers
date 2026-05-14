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
     * Is function mein hum customer ka asli data bSecure ko bhejte hain 
     * aur sath hi apne database mein order create karte hain.
     */
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'total'   => 'required|numeric',
            'name'    => 'required|string',
            'email'   => 'required|email',
            'phone'   => 'required',
            'address' => 'required|string',
            'cart'    => 'required|array',
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time();

            // SDK Configuration
            $orderSDK->setOrderId($merchantOrderId);

            // Customer Details (Frontend se aayi hui)
            $customer = [
                "name"         => $request->name,
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone,
                "address"      => $request->address,
            ];
            $orderSDK->setCustomer($customer);

            // Products Loop
            $products = [];
            foreach ($request->cart as $item) {
                $price = floatval($item['fixed_price'] ?? $item['price'] ?? 0);
                $making = floatval($item['making_charges'] ?? 0);
                $unitPrice = $price + $making;

                $products[] = [
                    "id"                => (string)($item['id']),
                    "name"              => (string)($item['name']),
                    "sku"               => "GSJ-" . $item['id'],
                    "quantity"          => (int)($item['quantity'] ?? 1),
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "discount"          => 0,
                    "image"             => $item['image'] ?? "",
                    "description"       => "Premium Jewelry",
                    "short_description" => "SilverGold Collection"
                ];
            }

            $orderSDK->setCartItems($products);
            $result = $orderSDK->createOrder();

            if (isset($result['body']['checkout_url'])) {
                // Database mein Order save karein (Naye columns ke sath)
                Order::create([
                    'order_id'         => $merchantOrderId,
                    'order_reference'  => $result['body']['order_reference'] ?? null,
                    'customer_name'    => $request->name,
                    'customer_email'   => $request->email,
                    'customer_phone'   => $request->phone,
                    'customer_address' => $request->address,
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
     * Payment ke baad bSecure user ko wapis yahan redirect karega.
     */
    public function verifyPayment(Request $request)
    {
        Log::info('bSecure Callback Data Received:', $request->all());

        try {
            // bSecure order_ref ya order_reference ke naam se query bhejta hai
            $order_ref = $request->query('order_ref') ?? $request->query('order_reference');

            if (!$order_ref) {
                Log::warning('Verification failed: No order reference.');
                return redirect('https://silvergoldjewellers.vercel.app/order-failed?error=no_ref');
            }

            // Status check karne ke liye SDK call karein
            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);

            Log::info('bSecure Status API Response:', ['result' => $result]);

            $localOrder = Order::where('order_reference', $order_ref)->first();
            $status = $result['body']['placement_status'] ?? null;

            // Status 3 = Successfully Placed / Paid
            if ($status == "3" || $status == 3) {
                if ($localOrder) {
                    $localOrder->update(['status' => 'completed']);
                }
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            // Agar payment fail hui
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