<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBirthdayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:birthdays,slug',
            'birth_date' => 'required|date',
            'timezone' => 'nullable|string|max:100',
            'profile_image' => 'nullable|string',
            'headline' => 'nullable|string|max:255',
            'birthday_message' => 'nullable|string',
            'letter_title' => 'nullable|string|max:255',
            'letter_content' => 'nullable|string',
            'signature' => 'nullable|string|max:255',
            'theme' => 'nullable|string|max:100',
            'custom_colors' => 'nullable|array',
            'music_path' => 'nullable|string',
            'visibility' => 'nullable|string|in:public,private,password_protected',
            'password' => 'nullable|string|min:4',
            'status' => 'nullable|string|in:draft,published',
        ];
    }
}
