<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Birthday;
use App\Models\BirthdaySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BirthdaySettingsController extends Controller
{
    public function show(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $settings = $birthday->settings ?? BirthdaySetting::create(['birthday_id' => $birthday->id]);

        return response()->json([
            'data' => $settings
        ]);
    }

    public function update(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $settings = $birthday->settings ?? BirthdaySetting::create(['birthday_id' => $birthday->id]);

        $validated = $request->validate([
            'countdown_enabled' => 'nullable|boolean',
            'cake_animation_enabled' => 'nullable|boolean',
            'music_enabled' => 'nullable|boolean',
            'gallery_enabled' => 'nullable|boolean',
            'timeline_enabled' => 'nullable|boolean',
            'surprise_enabled' => 'nullable|boolean',
            'wishes_enabled' => 'nullable|boolean',
            'settings' => 'nullable|array',
        ]);

        $settings->update($validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $settings
        ]);
    }
}
