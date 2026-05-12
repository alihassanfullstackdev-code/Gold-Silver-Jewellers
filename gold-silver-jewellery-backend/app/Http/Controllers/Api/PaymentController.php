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
            $order = new BsecureCheckout();

            // 1. Order ID set karein
            $order->setOrderId('GSJ-' . time());

            // 2. Customer details (Request se phone number lein)
            $customer = [
                "name" => $request->name ?? "Customer",
                "email" => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $order->setCustomer($customer);

            // 3. Sabse important: Cart Items mein amount bhejna lazmi hai
            // Agar aap pure items nahi bhej rahe, to ek dummy item bhejein total price ke sath
            $products = [
                [
                    "id"          => "1",
                    "name"        => "Jewelry Item", // Aap "Order Total" bhi likh sakte hain
                    "sku"         => "GSJ-001",
                    "quantity"    => 1,
                    "price"       => $request->total,
                    "sale_price"  => $request->total,
                    "image"       => "",
                    "description" => "Jewelry purchase from SilverGold&Jewellers"
                ]
            ];
            $order->setCartItems($products);

            // 4. Create Order
            $result = $order->createOrder();

            // Debugging ke liye: Agar checkout_url nahi milta to full response check karein
            if (!empty($result['checkout_url'])) {
                return response()->json([
                    'success' => true,
                    'checkout_url' => $result['checkout_url'],
                    'order_ref' => $result['order_reference'] ?? null
                ], 200);
            }

            // Agar fail ho jaye, to bSecure ka asli error message wapis bhejien
            return response()->json([
                'success' => false,
                'message' => 'bSecure API Error',
                'details' => $result // Isse Thunder Client par asli wajah nazar ayegi
            ], 400);
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
