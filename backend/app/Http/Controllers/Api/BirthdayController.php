<?php

namespace App\Http\Controllers\Api;

use App\Enums\BirthdayStatus;
use App\Enums\BirthdayVisibility;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBirthdayRequest;
use App\Http\Requests\UpdateBirthdayRequest;
use App\Http\Resources\BirthdayResource;
use App\Models\Birthday;
use App\Models\BirthdaySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BirthdayController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $birthdays = $request->user()->birthdays()
            ->with(['settings'])
            ->withCount(['photos', 'memories', 'wishes'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $birthdays
        ]);
    }

    public function store(StoreBirthdayRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        if (!empty($validated['password'])) {
            $validated['password_hash'] = Hash::make($validated['password']);
            unset($validated['password']);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        // Handle file uploads if present
        if ($request->hasFile('profile_image_file')) {
            $path = $request->file('profile_image_file')->store('profiles', 'public');
            $validated['profile_image'] = Storage::url($path);
        }

        if ($request->hasFile('music_file')) {
            $path = $request->file('music_file')->store('music', 'public');
            $validated['music_path'] = Storage::url($path);
        }

        $birthday = Birthday::create($validated);

        // Initialize default settings for this birthday
        BirthdaySetting::create([
            'birthday_id' => $birthday->id,
            'countdown_enabled' => true,
            'cake_animation_enabled' => true,
            'music_enabled' => true,
            'gallery_enabled' => true,
            'timeline_enabled' => true,
            'surprise_enabled' => true,
            'wishes_enabled' => true,
        ]);

        return response()->json([
            'message' => 'Birthday page created successfully',
            'data' => new BirthdayResource($birthday->load(['photos', 'memories', 'wishes', 'settings']))
        ], 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)
            ->with(['photos', 'memories', 'wishes', 'settings'])
            ->findOrFail($id);

        return response()->json([
            'data' => new BirthdayResource($birthday)
        ]);
    }

    public function update(UpdateBirthdayRequest $request, $id): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($id);
        $validated = $request->validated();

        if (array_key_exists('password', $validated)) {
            if (!empty($validated['password'])) {
                $validated['password_hash'] = Hash::make($validated['password']);
            } else {
                $validated['password_hash'] = null;
            }
            unset($validated['password']);
        }

        if ($request->hasFile('profile_image_file')) {
            $path = $request->file('profile_image_file')->store('profiles', 'public');
            $validated['profile_image'] = Storage::url($path);
        }

        if ($request->hasFile('music_file')) {
            $path = $request->file('music_file')->store('music', 'public');
            $validated['music_path'] = Storage::url($path);
        }

        $birthday->update($validated);

        return response()->json([
            'message' => 'Birthday page updated successfully',
            'data' => new BirthdayResource($birthday->load(['photos', 'memories', 'wishes', 'settings']))
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($id);
        $birthday->delete();

        return response()->json([
            'message' => 'Birthday page deleted successfully'
        ]);
    }

    public function publish(Request $request, $id): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($id);
        $birthday->update([
            'status' => BirthdayStatus::PUBLISHED,
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Birthday page published',
            'data' => new BirthdayResource($birthday)
        ]);
    }

    public function unpublish(Request $request, $id): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($id);
        $birthday->update([
            'status' => BirthdayStatus::DRAFT,
        ]);

        return response()->json([
            'message' => 'Birthday page draft mode enabled',
            'data' => new BirthdayResource($birthday)
        ]);
    }

    // Public API Endpoints
    public function getPublicBySlug(Request $request, string $slug): JsonResponse
    {
        $birthday = Birthday::where('slug', $slug)
            ->where('status', BirthdayStatus::PUBLISHED)
            ->with(['photos', 'memories', 'settings'])
            ->with(['wishes' => function ($query) {
                $query->where('status', 'approved')->latest();
            }])
            ->firstOrFail();

        // Check if password protected
        if ($birthday->visibility === BirthdayVisibility::PASSWORD_PROTECTED || !empty($birthday->password_hash)) {
            $providedPassword = $request->header('X-Birthday-Password') ?? $request->query('password');
            $isUnlocked = false;

            if ($providedPassword && Hash::check($providedPassword, $birthday->password_hash)) {
                $isUnlocked = true;
            }

            if (!$isUnlocked) {
                return response()->json([
                    'locked' => true,
                    'message' => 'This birthday experience is password protected.',
                    'name' => $birthday->name,
                    'slug' => $birthday->slug,
                    'theme' => $birthday->theme,
                ], 403);
            }
        }

        return response()->json([
            'locked' => false,
            'data' => new BirthdayResource($birthday)
        ]);
    }

    public function unlockPublicPage(Request $request, string $slug): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $birthday = Birthday::where('slug', $slug)
            ->where('status', BirthdayStatus::PUBLISHED)
            ->firstOrFail();

        if (Hash::check($request->password, $birthday->password_hash)) {
            return response()->json([
                'unlocked' => true,
                'message' => 'Password correct',
                'data' => new BirthdayResource($birthday->load(['photos', 'memories', 'settings', 'wishes' => function ($q) {
                    $q->where('status', 'approved')->latest();
                }]))
            ]);
        }

        return response()->json([
            'unlocked' => false,
            'message' => 'Incorrect password. Please try again.'
        ], 401);
    }

    public function overviewStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totalPages = Birthday::where('user_id', $userId)->count();
        $publishedPages = Birthday::where('user_id', $userId)->where('status', BirthdayStatus::PUBLISHED)->count();
        $draftPages = Birthday::where('user_id', $userId)->where('status', BirthdayStatus::DRAFT)->count();

        $birthdayIds = Birthday::where('user_id', $userId)->pluck('id');
        $totalApprovedWishes = \App\Models\BirthdayWish::whereIn('birthday_id', $birthdayIds)
            ->where('status', 'approved')
            ->count();
        $totalPendingWishes = \App\Models\BirthdayWish::whereIn('birthday_id', $birthdayIds)
            ->where('status', 'pending')
            ->count();

        $recentPages = Birthday::where('user_id', $userId)->latest()->take(5)->get();

        return response()->json([
            'stats' => [
                'total_pages' => $totalPages,
                'published_pages' => $publishedPages,
                'draft_pages' => $draftPages,
                'approved_wishes' => $totalApprovedWishes,
                'pending_wishes' => $totalPendingWishes,
            ],
            'recent_pages' => BirthdayResource::collection($recentPages),
        ]);
    }
}
