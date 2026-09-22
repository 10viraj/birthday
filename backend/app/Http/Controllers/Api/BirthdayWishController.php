<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBirthdayWishRequest;
use App\Http\Resources\BirthdayWishResource;
use App\Models\Birthday;
use App\Models\BirthdayWish;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BirthdayWishController extends Controller
{
    // Public: submit a wish for a birthday by slug
    public function submitPublicWish(StoreBirthdayWishRequest $request, string $slug): JsonResponse
    {
        $birthday = Birthday::where('slug', $slug)->firstOrFail();
        $validated = $request->validated();

        $wish = BirthdayWish::create([
            'birthday_id' => $birthday->id,
            'visitor_name' => $validated['visitor_name'],
            'message' => $validated['message'],
            'status' => 'approved', // Auto-approved for instant joy, editable by admin
        ]);

        return response()->json([
            'message' => 'Thank you! Your birthday wish has been submitted.',
            'data' => new BirthdayWishResource($wish)
        ], 201);
    }

    // Public: get approved wishes for a birthday page
    public function getPublicWishes(string $slug): JsonResponse
    {
        $birthday = Birthday::where('slug', $slug)->firstOrFail();
        $wishes = $birthday->wishes()
            ->where('status', 'approved')
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => BirthdayWishResource::collection($wishes),
            'meta' => [
                'current_page' => $wishes->currentPage(),
                'last_page' => $wishes->lastPage(),
                'total' => $wishes->total(),
            ]
        ]);
    }

    // Admin: list all wishes for a birthday
    public function indexAdmin(Request $request, $birthdayId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);

        $query = $birthday->wishes();

        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('visitor_name', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $wishes = $query->latest()->get();

        return response()->json([
            'data' => BirthdayWishResource::collection($wishes)
        ]);
    }

    // Admin: approve wish
    public function approve(Request $request, $birthdayId, $wishId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $wish = BirthdayWish::where('birthday_id', $birthday->id)->findOrFail($wishId);

        $wish->update(['status' => 'approved']);

        return response()->json([
            'message' => 'Wish approved successfully',
            'data' => new BirthdayWishResource($wish)
        ]);
    }

    // Admin: reject wish
    public function reject(Request $request, $birthdayId, $wishId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $wish = BirthdayWish::where('birthday_id', $birthday->id)->findOrFail($wishId);

        $wish->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Wish rejected successfully',
            'data' => new BirthdayWishResource($wish)
        ]);
    }

    // Admin: delete wish
    public function destroy(Request $request, $birthdayId, $wishId): JsonResponse
    {
        $birthday = Birthday::where('user_id', $request->user()->id)->findOrFail($birthdayId);
        $wish = BirthdayWish::where('birthday_id', $birthday->id)->findOrFail($wishId);

        $wish->delete();

        return response()->json([
            'message' => 'Wish deleted successfully'
        ]);
    }
}
