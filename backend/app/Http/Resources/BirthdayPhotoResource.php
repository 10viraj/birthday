<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imagePath = $this->image_path;
        if ($imagePath && !str_starts_with($imagePath, 'data:') && !str_starts_with($imagePath, 'blob:')) {
            $appUrl = rtrim(config('app.url', ''), '/');
            if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i', $imagePath) && $appUrl && !str_contains($appUrl, 'localhost') && !str_contains($appUrl, '127.0.0.1')) {
                $imagePath = preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i', $appUrl, $imagePath);
            } elseif (str_starts_with($imagePath, '/storage') || str_starts_with($imagePath, 'storage/')) {
                $clean = ltrim($imagePath, '/');
                $imagePath = $appUrl ? "{$appUrl}/{$clean}" : "/{$clean}";
            }
        }

        return [
            'id' => $this->id,
            'birthday_id' => $this->birthday_id,
            'image_path' => $imagePath,
            'caption' => $this->caption,
            'description' => $this->description,
            'taken_at' => $this->taken_at?->format('Y-m-d'),
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
        ];
    }
}
