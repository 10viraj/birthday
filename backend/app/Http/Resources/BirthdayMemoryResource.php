<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayMemoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'birthday_id' => $this->birthday_id,
            'title' => $this->title,
            'description' => $this->description,
            'memory_date' => $this->memory_date?->format('Y-m-d'),
            'image_path' => $this->image_path,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
        ];
    }
}
