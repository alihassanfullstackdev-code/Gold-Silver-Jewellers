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
     * 1. FRONTEND API: Cash on Delivery Order Save Karna
     */
    public function placeCodOrder(Request $request)
    {
        // Validation: Frontend se aane wale data ko check karna
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'total' => 'required|numeric',
            'cart'  => 'required|array|min:1',
            // Aap niche baaki inputs (name, phone, address) bhi save kar sakte hain agar cart_details json mein bhejna chahein
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        try {
            // Unique Merchant Order ID generate karna (Jaise: GSJ-A1B2C3D4)
            $merchantOrderId = 'GSJ-' . strtoupper(Str::random(8));

            // Frontend ke saare data aur cart items ko aik single array mein merge karna taake cart_details JSON mein save ho sakay
            $cartDetailsJson = json_encode([
                'customer_info' => [
                    'name'    => $validatedData['name'],
                    'phone'   => $validatedData['phone'],
                    'address' => $validatedData['address'],
                ],
                'items' => $validatedData['cart']
            ]);

            // Aapki migration ke exact columns ke mutabiq data insert karna
            $id = DB::table('orders')->insertGetId([
                'order_id'        => $merchantOrderId,
                'order_reference' => 'COD-ORDER', // bSecure ka reference nahi hai toh humne 'COD-ORDER' default rakh diya
                'customer_email'  => $validatedData['email'],
                'total_amount'    => $validatedData['total'],
                'status'          => 'pending', // Aapki migration ka default 'pending' hai
                'cart_details'    => $cartDetailsJson,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully via Cash on Delivery.',
                'merchant_order_id' => $merchantOrderId,
                'db_id' => $id
            ], 201);
        } catch (Exception $e) {
            Log::error('COD Order Placement Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Server Error. Failed to place order.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. DASHBOARD API: Saare Orders Fetch Karna
     */
    public function getDashboardOrders()
    {
        try {
            // Latest orders sabse pehle nikalna
            $orders = DB::table('orders')
                ->orderBy('created_at', 'desc')
                ->get();

            // JSON data ko response mein format karna taake frontend par direct use ho sakay
            foreach ($orders as $order) {
                if ($order->cart_details) {
                    $order->cart_details = json_decode($order->cart_details);
                }
            }

            return response()->json([
                'success' => true,
                'count' => $orders->count(),
                'orders' => $orders
            ], 200);
        } catch (Exception $e) {
            Log::error('Dashboard Fetch Orders Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard orders.',
            ], 500);
        }
    }

    /**
     * 3. DASHBOARD API: Order Status Update Karna (Pending -> Completed/Failed)
     */
    public function updateOrderStatus(Request $request, $id)
    {
        // Aapki migration ke status enum/string rules ke mutabiq validation
        $request->validate([
            'status' => 'required|string|in:pending,completed,failed',
        ]);

        try {
            $updated = DB::table('orders')
                ->where('id', $id)
                ->update([
                    'status' => $request->status,
                    'updated_at' => now()
                ]);

            if ($updated) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order status updated successfully.'
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Order not found or no changes made.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status.'
            ], 500);
        }
    }
}
