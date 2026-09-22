<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'timezone' => $this->timezone ?? 'UTC',
            'profile_image' => $this->profile_image,
            'headline' => $this->headline,
            'birthday_message' => $this->birthday_message,
            'letter_title' => $this->letter_title,
            'letter_content' => $this->letter_content,
            'signature' => $this->signature,
            'theme' => $this->theme,
            'custom_colors' => $this->custom_colors,
            'music_path' => $this->music_path,
            'visibility' => is_object($this->visibility) ? $this->visibility->value : $this->visibility,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'is_password_protected' => !empty($this->password_hash),
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'photos' => BirthdayPhotoResource::collection($this->whenLoaded('photos')),
            'memories' => BirthdayMemoryResource::collection($this->whenLoaded('memories')),
            'wishes' => BirthdayWishResource::collection($this->whenLoaded('wishes')),
            'settings' => $this->whenLoaded('settings'),
        ];
    }
}
