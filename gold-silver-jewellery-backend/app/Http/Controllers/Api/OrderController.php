<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class OrderController extends Controller
{
    /**
     * FRONTEND API: Cash on Delivery Order Save Karna
     */
    public function placeCodOrder(Request $request)
    {
        // 1. Validation
        $validatedData = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'required|string|max:20',
            'address' => 'required|string',
            'city'    => 'required|string|max:100', // City ko hum address ke sath merge karenge
            'total'   => 'required|numeric',
            'cart'    => 'required|array|min:1',
            'orderNotes' => 'nullable|string',
        ]);

        try {
            // Unique Merchant Order ID (Jaise video mein GSJ-123... tha)
            $merchantOrderId = 'GSJ-' . strtoupper(Str::random(8));

            // City aur Order Notes ko Shipping Address ke sath aik line mein merge kar dete hain
            $completeAddress = $validatedData['address'] . ' , City: ' . $validatedData['city'];
            if (!empty($request->orderNotes)) {
                $completeAddress .= ' (Instructions: ' . $request->orderNotes . ')';
            }

            // 2. Insert into Database (Exact matching your video columns)
            $id = DB::table('orders')->insertGetId([
                'order_id'         => $merchantOrderId,
                'order_reference'  => 'COD-ORDER', // Manual COD identify karne ke liye
                'customer_name'    => $validatedData['name'],
                'customer_email'   => $validatedData['email'],
                'customer_phone'   => $validatedData['phone'],
                'shipping_address' => $completeAddress,
                'total_amount'     => $validatedData['total'],
                'status'           => 'pending', // Default status matching migration
                'cart_details'     => json_encode($validatedData['cart']), // Sirf products ka json array
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mubarak ho! Order placed successfully.',
                'order_id' => $merchantOrderId
            ], 201);
        } catch (Exception $e) {
            Log::error('COD Order Insertion Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order on server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DASHBOARD API: Saare Orders Fetch Karna
     */
    public function getDashboardOrders()
    {
        try {
            $orders = DB::table('orders')->orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'orders' => $orders
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error fetching orders.'], 500);
        }
    }
}
