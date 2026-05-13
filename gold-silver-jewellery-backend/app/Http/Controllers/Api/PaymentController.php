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
        // 1. Validation
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
            'cart'  => 'required|array',
        ]);

        try {
            $orderSDK = new BsecureCheckout();
            $merchantOrderId = 'GSJ-' . time();
            
            // 2. Core Configurations
            $orderSDK->setOrderId($merchantOrderId);
            
            // Merchant ID from your portal (9117)
            $orderSDK->setMerchantId('9117'); 
            
            // Explicitly set the return URL for verification
            $orderSDK->setCallbackUrl('https://gold-silver-jewellers-production.up.railway.app/api/payment/verify');

            // 3. Customer Data
            $customer = [
                "name"         => $request->name ?? "Valued Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $orderSDK->setCustomer($customer);

            // 4. Products Mapping
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
            
            // 5. Create Order
            $result = $orderSDK->createOrder();

            // 6. Handle Response (Checking inside 'body' key)
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
                    'checkout_url' => $result['body']['checkout_url'],
                ], 200);
            }

            // Return Error Details if bSecure rejects
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
        Log::info('bSecure Callback Data Received:', $request->all());

        try {
            // Support both potential query keys
            $order_ref = $request->query('order_ref') ?? $request->query('order_reference');

            if (!$order_ref) {
                Log::warning('Verification failed: No order reference.');
                return redirect('https://silvergoldjewellers.vercel.app/order-failed?error=no_ref');
            }

            $orderStatusUpdate = new BsecureCheckout();
            $result = $orderStatusUpdate->orderStatusUpdates($order_ref);
            
            Log::info('bSecure Status API Response:', ['result' => $result]);

            $localOrder = Order::where('order_reference', $order_ref)->first();
            $status = $result['body']['placement_status'] ?? null;

            // Status 3 means order has been successfully placed
            if ($status == "3" || $status == 3) {
                if ($localOrder) {
                    $localOrder->update(['status' => 'completed']);
                }
                return redirect('https://silvergoldjewellers.vercel.app/order-success?ref=' . $order_ref);
            }

            // If not successful, update as failed
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