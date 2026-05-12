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
        $request->validate([
            'total' => 'required|numeric',
            'email' => 'required|email',
            'cart'  => 'required|array', 
        ]);

        try {
            $order = new BsecureCheckout();
            $order->setOrderId('GSJ-' . time());

            $customer = [
                "name"         => $request->name ?? "Customer",
                "email"        => $request->email,
                "country_code" => "92",
                "phone_number" => $request->phone ?? "3001234567",
            ];
            $order->setCustomer($customer);

            $products = [];
            foreach ($request->cart as $item) {
                // Image URL logic
                $imageUrl = $item['image'];
                if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    $imageUrl = "https://gold-silver-jewellers-production.up.railway.app/storage/" . $item['image'];
                }

                // Har item ki apni price aur quantity yahan set ho rahi hai
                $unitPrice = (float)($item['fixed_price'] + ($item['making_charges'] ?? 0));

                $products[] = [
                    "id"                => (string)$item['id'],
                    "name"              => $item['name'],
                    "sku"               => $item['sku'] ?? 'GSJ-' . $item['id'],
                    "quantity"          => (int)$item['quantity'], // <-- Yeh quantity bSecure page par show hogi
                    "price"             => $unitPrice,
                    "sale_price"        => $unitPrice,
                    "image"             => $imageUrl, 
                    "description"       => $item['name'] . " - Premium Collection",
                    "short_description" => "SilverGold Jewelry"
                ];
            }
            
            $order->setCartItems($products);

            $result = $order->createOrder();

            if (isset($result['body']['checkout_url'])) {
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
}