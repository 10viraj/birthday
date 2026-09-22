<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBirthdayPhotoRequest;
use App\Http\Resources\BirthdayPhotoResource;
use App\Models\Birthday;
use App\Models\BirthdayPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BirthdayPhotoController extends Controller
{
    public function index(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $photos = $birthday->photos()->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'data' => BirthdayPhotoResource::collection($photos)
        ]);
    }

    public function store(StoreBirthdayPhotoRequest $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $validated = $request->validated();

        $imagePath = $validated['image_path'] ?? null;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('gallery', 'public');
            $imagePath = Storage::url($path);
        }

        if (!$imagePath) {
            return response()->json(['message' => 'Image photo file or image_path is required'], 422);
        }

        $photo = BirthdayPhoto::create([
            'birthday_id' => $birthday->id,
            'image_path' => $imagePath,
            'caption' => $validated['caption'] ?? null,
            'description' => $validated['description'] ?? null,
            'taken_at' => $validated['taken_at'] ?? null,
            'sort_order' => $validated['sort_order'] ?? ($birthday->photos()->max('sort_order') + 1),
        ]);

        return response()->json([
            'message' => 'Photo added successfully',
            'data' => new BirthdayPhotoResource($photo)
        ], 201);
    }

    public function storeBatch(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);

        $request->validate([
            'photos' => 'nullable|array',
            'photos.*' => 'file|image|max:10240',
            'image_urls' => 'nullable|string',
            'caption' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'taken_at' => 'nullable|date',
        ]);

        $createdPhotos = [];
        $currentSortOrder = (int) $birthday->photos()->max('sort_order');

        // 1. Process uploaded file array
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $idx => $file) {
                $path = $file->store('gallery', 'public');
                $url = Storage::url($path);
                $currentSortOrder++;

                $photo = BirthdayPhoto::create([
                    'birthday_id' => $birthday->id,
                    'image_path' => $url,
                    'caption' => $request->caption ? "{$request->caption} (" . ($idx + 1) . ")" : $file->getClientOriginalName(),
                    'description' => $request->description ?? null,
                    'taken_at' => $request->taken_at ?? null,
                    'sort_order' => $currentSortOrder,
                ]);

                $createdPhotos[] = new BirthdayPhotoResource($photo);
            }
        }

        // 2. Process pasted image URLs
        if ($request->has('image_urls') && !empty($request->image_urls)) {
            $urls = array_filter(array_map('trim', preg_split('/[\r\n,]+/', $request->image_urls)));
            foreach ($urls as $idx => $url) {
                if (filter_var($url, FILTER_VALIDATE_URL) || str_starts_with($url, 'http') || str_starts_with($url, '/')) {
                    $currentSortOrder++;
                    $photo = BirthdayPhoto::create([
                        'birthday_id' => $birthday->id,
                        'image_path' => $url,
                        'caption' => $request->caption ? "{$request->caption} (" . ($idx + 1) . ")" : 'Memory Photo',
                        'description' => $request->description ?? null,
                        'taken_at' => $request->taken_at ?? null,
                        'sort_order' => $currentSortOrder,
                    ]);

                    $createdPhotos[] = new BirthdayPhotoResource($photo);
                }
            }
        }

        if (empty($createdPhotos)) {
            return response()->json(['message' => 'No valid photo files or image URLs provided.'], 422);
        }

        return response()->json([
            'message' => count($createdPhotos) . ' photos added successfully to gallery!',
            'data' => $createdPhotos
        ], 201);
    }

    public function update(Request $request, $birthdayId, $photoId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $photo = BirthdayPhoto::where('birthday_id', $birthday->id)->findOrFail($photoId);

        $validated = $request->validate([
            'caption' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'taken_at' => 'nullable|date',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('gallery', 'public');
            $validated['image_path'] = Storage::url($path);
        }

        $photo->update($validated);

        return response()->json([
            'message' => 'Photo updated successfully',
            'data' => new BirthdayPhotoResource($photo)
        ]);
    }

    public function destroy(Request $request, $birthdayId, $photoId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $photo = BirthdayPhoto::where('birthday_id', $birthday->id)->findOrFail($photoId);

        $photo->delete();

        return response()->json([
            'message' => 'Photo deleted successfully'
        ]);
    }

    public function reorder(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);

        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|integer|exists:birthday_photos,id',
            'order.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->order as $item) {
            BirthdayPhoto::where('birthday_id', $birthday->id)
                ->where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Photos reordered successfully'
        ]);
    }
}
