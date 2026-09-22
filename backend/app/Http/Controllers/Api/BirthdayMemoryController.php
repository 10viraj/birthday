<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BirthdayMemoryResource;
use App\Models\Birthday;
use App\Models\BirthdayMemory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BirthdayMemoryController extends Controller
{
    public function index(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $memories = $birthday->memories()->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'data' => BirthdayMemoryResource::collection($memories)
        ]);
    }

    public function store(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'memory_date' => 'required|date',
            'image_path' => 'nullable|string',
            'image' => 'nullable|file|image|max:10240',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('memories', 'public');
            $validated['image_path'] = Storage::url($path);
        }

        $memory = BirthdayMemory::create([
            'birthday_id' => $birthday->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'memory_date' => $validated['memory_date'],
            'image_path' => $validated['image_path'] ?? null,
            'sort_order' => $validated['sort_order'] ?? ($birthday->memories()->max('sort_order') + 1),
        ]);

        return response()->json([
            'message' => 'Memory created successfully',
            'data' => new BirthdayMemoryResource($memory)
        ], 201);
    }

    public function update(Request $request, $birthdayId, $memoryId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $memory = BirthdayMemory::where('birthday_id', $birthday->id)->findOrFail($memoryId);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'memory_date' => 'sometimes|required|date',
            'image_path' => 'nullable|string',
            'image' => 'nullable|file|image|max:10240',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('memories', 'public');
            $validated['image_path'] = Storage::url($path);
        }

        $memory->update($validated);

        return response()->json([
            'message' => 'Memory updated successfully',
            'data' => new BirthdayMemoryResource($memory)
        ]);
    }

    public function destroy(Request $request, $birthdayId, $memoryId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $memory = BirthdayMemory::where('birthday_id', $birthday->id)->findOrFail($memoryId);

        $memory->delete();

        return response()->json([
            'message' => 'Memory deleted successfully'
        ]);
    }
}
