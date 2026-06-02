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
     * Frontend Endpoint: Save Order coming from client app
     */
    public function placeCodOrder(Request $request)
    {
        // 1. Validation for explicit incoming JSON keys
        $validatedData = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'phone'      => 'required|string|max:20',
            'address'    => 'required|string',
            'city'       => 'required|string|max:100',
            'total'      => 'required|numeric',
            'cart'       => 'required|array|min:1',
            'orderNotes' => 'nullable|string',
        ]);

        try {
            // Unique Merchant Identity Generation
            $merchantOrderId = 'GSJ-' . strtoupper(Str::random(8));

            // Merge details accurately into database table format
            $completeAddress = $validatedData['address'] . ' , City: ' . $validatedData['city'];
            if (!empty($validatedData['orderNotes'])) {
                $completeAddress .= ' (Instructions: ' . $validatedData['orderNotes'] . ')';
            }

            // 2. Query builder insertion matching exactly your migration setup
            DB::table('orders')->insertGetId([
                'order_id'         => $merchantOrderId,
                'order_reference'  => 'COD-ORDER',
                'customer_name'    => $validatedData['name'],
                'customer_email'   => $validatedData['email'],
                'customer_phone'   => $validatedData['phone'],
                'customer_address' => $completeAddress,
                'total_amount'     => $validatedData['total'],
                'status'           => 'pending',
                'cart_details'     => json_encode($validatedData['cart']),
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
     * Admin Dashboard Endpoint: List all records
     */
    /**
     * Admin Dashboard Endpoint: List records with pagination
     */
    public function getDashboardOrders(Request $request)
    {
        try {
            // Optional filter logic integration layer (all, pending, etc.)
            $status = $request->query('status', 'all');

            $query = DB::table('orders');

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            // Standard length-aware pagination sequence (10 items per chunk execution)
            $orders = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'orders'  => $orders->items(),
                'pagination' => [
                    'total'        => $orders->total(),
                    'per_page'     => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page'    => $orders->lastPage(),
                    'from'         => $orders->firstItem(),
                    'to'           => $orders->lastItem()
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error fetching orders.'], 500);
        }
    }

    /**
     * Admin Dashboard Endpoint: Hard delete a specific order resource
     */
    public function deleteOrder($id)
    {
        try {
            // Check record existence before destroying reference stack
            $orderExists = DB::table('orders')->where('id', $id)->exists();

            if (!$orderExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order record not found inside database storage.'
                ], 404);
            }

            DB::table('orders')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order destroyed securely from vault.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pipeline failure execution context on deletion.'
            ], 500);
        }
    }

    /**
     * Admin Dashboard Endpoint: Update specific target status
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,completed,failed,canceled'
        ]);

        try {
            DB::table('orders')->where('id', $id)->update([
                'status' => $validated['status'],
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully.'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update status.'], 500);
        }
    }
}
