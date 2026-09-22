<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayWishResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'birthday_id' => $this->birthday_id,
            'visitor_name' => $this->visitor_name,
            'message' => $this->message,
            'status' => $this->status,
            'created_at' => $this->created_at?->diffForHumans() ?? $this->created_at,
        ];
    }
}
