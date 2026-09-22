<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBirthdayPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo' => 'nullable|file|image|max:10240', // 10MB
            'image_path' => 'nullable|string',
            'caption' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'taken_at' => 'nullable|date',
            'sort_order' => 'nullable|integer',
        ];
    }
}
