<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'birthday_id' => $this->birthday_id,
            'image_path' => $this->image_path,
            'caption' => $this->caption,
            'description' => $this->description,
            'taken_at' => $this->taken_at?->format('Y-m-d'),
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
        ];
    }
}
