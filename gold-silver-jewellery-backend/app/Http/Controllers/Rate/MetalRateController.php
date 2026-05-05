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
}
