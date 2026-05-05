<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MetalRateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gold_24k' => number_format((float)$this->gold_24k, 0, '.', ','),
            'gold_22k' => number_format((float)$this->gold_22k, 0, '.', ','),
            'gold_21k' => number_format((float)$this->gold_21k, 0, '.', ','),
            'gold_18k' => number_format((float)$this->gold_18k, 0, '.', ','),
            'silver'   => number_format((float)$this->silver, 0, '.', ','),
            'platinum' => number_format((float)$this->platinum, 0, '.', ','),
            'updated_at' => $this->created_at->format('d M, Y - h:i A'),
        ];
    }
}