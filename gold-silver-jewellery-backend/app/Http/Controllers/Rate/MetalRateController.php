<?php

namespace App\Http\Controllers\Rate;

use App\Http\Controllers\Controller;
use App\Models\MetalRate;
use App\Http\Resources\MetalRateResource;
use Illuminate\Http\Request;

class MetalRateController extends Controller
{
    /**
     * Display a listing of the resource with Pagination.
     */
    public function index()
    {
        // 10 records per page aur latest sab se pehle
        $rates = MetalRate::latest()->paginate(10);

        // MetalRateResource::collection automatic pagination links add kar deta hai
        return MetalRateResource::collection($rates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'gold_24k' => 'required|numeric|min:1',
            'silver'   => 'required|numeric|min:1',
            'platinum' => 'required|numeric|min:1',
        ]);

        $g24 = $request->gold_24k;

        $rate = MetalRate::create([
            'gold_24k' => $g24,
            'gold_22k' => round($g24 * (22 / 24), 2),
            'gold_21k' => round($g24 * (21 / 24), 2),
            'gold_18k' => round($g24 * (18 / 24), 2), // Last gold karat
            'silver'   => $request->silver,
            'platinum' => $request->platinum,
        ]);

        return new MetalRateResource($rate);
    }

    public function destroy($id)
    {
        $rate = MetalRate::findOrFail($id);
        $rate->delete();
        return response()->json(['message' => 'Record deleted successfully']);
    }

    /**
     * Frontend Public Endpoint: Fetch the single absolute latest pricing configuration
     * Route: GET /api/live-rates/active
     */
    public function getLatestRates()
    {
        try {
            // Database se sabse latest record uthayen
            $latestRate = MetalRate::latest()->first();

            if (!$latestRate) {
                return response()->json([
                    'success' => false,
                    'message' => 'No rates found in the datastore layer.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'rates' => [
                    'gold_24k'     => (float) $latestRate->gold_24k,
                    'gold_22k'     => (float) $latestRate->gold_22k,
                    'gold_21k'     => (float) $latestRate->gold_21k,
                    'gold_18k'     => (float) $latestRate->gold_18k,
                    'silver'       => (float) $latestRate->silver,
                    'platinum'     => (float) $latestRate->platinum,
                    'last_updated' => $latestRate->created_at->toIso8601String()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error while compiling metadata context framework.'
            ], 500);
        }
    }
}
