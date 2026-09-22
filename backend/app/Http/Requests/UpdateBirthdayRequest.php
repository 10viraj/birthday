<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBirthdayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $birthdayId = $this->route('id') ?? $this->route('birthday');

        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('birthdays', 'slug')->ignore($birthdayId)],
            'birth_date' => 'sometimes|required|date',
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
