<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BirthdayController;
use App\Http\Controllers\Api\BirthdayMemoryController;
use App\Http\Controllers\Api\BirthdayPhotoController;
use App\Http\Controllers\Api\BirthdaySettingsController;
use App\Http\Controllers\Api\BirthdayWishController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Birthday Page
Route::get('/public/birthdays/{slug}', [BirthdayController::class, 'getPublicBySlug']);
Route::post('/public/birthdays/{slug}/unlock', [BirthdayController::class, 'unlockPublicPage']);
Route::get('/public/birthdays/{slug}/wishes', [BirthdayWishController::class, 'getPublicWishes']);
Route::post('/public/birthdays/{slug}/wishes', [BirthdayWishController::class, 'submitPublicWish']);
Route::post('/public/birthdays/{slug}/photos', [BirthdayPhotoController::class, 'storePublic']);
Route::post('/public/birthdays/{slug}/photos/batch', [BirthdayPhotoController::class, 'storePublicBatch']);
Route::delete('/public/birthdays/{slug}/photos/{photoId}', [BirthdayPhotoController::class, 'destroyPublic']);

/*
|--------------------------------------------------------------------------
| Authenticated Admin Routes (Sanctum Protected)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Current User & Logout
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Overview Stats
    Route::get('/birthdays/stats/overview', [BirthdayController::class, 'overviewStats']);

    // Birthday CRUD
    Route::get('/birthdays', [BirthdayController::class, 'index']);
    Route::post('/birthdays', [BirthdayController::class, 'store']);
    Route::get('/birthdays/{id}', [BirthdayController::class, 'show']);
    Route::put('/birthdays/{id}', [BirthdayController::class, 'update']);
    Route::delete('/birthdays/{id}', [BirthdayController::class, 'destroy']);
    Route::post('/birthdays/{id}/publish', [BirthdayController::class, 'publish']);
    Route::post('/birthdays/{id}/unpublish', [BirthdayController::class, 'unpublish']);

    // Gallery Management
    Route::get('/birthdays/{id}/photos', [BirthdayPhotoController::class, 'index']);
    Route::post('/birthdays/{id}/photos', [BirthdayPhotoController::class, 'store']);
    Route::post('/birthdays/{id}/photos/batch', [BirthdayPhotoController::class, 'storeBatch']);
    Route::put('/birthdays/{id}/photos/{photoId}', [BirthdayPhotoController::class, 'update']);
    Route::delete('/birthdays/{id}/photos/{photoId}', [BirthdayPhotoController::class, 'destroy']);
    Route::patch('/birthdays/{id}/photos/reorder', [BirthdayPhotoController::class, 'reorder']);

    // Memories Management
    Route::get('/birthdays/{id}/memories', [BirthdayMemoryController::class, 'index']);
    Route::post('/birthdays/{id}/memories', [BirthdayMemoryController::class, 'store']);
    Route::put('/birthdays/{id}/memories/{memoryId}', [BirthdayMemoryController::class, 'update']);
    Route::delete('/birthdays/{id}/memories/{memoryId}', [BirthdayMemoryController::class, 'destroy']);

    // Admin Wishes Management
    Route::get('/birthdays/{id}/wishes', [BirthdayWishController::class, 'indexAdmin']);
    Route::patch('/birthdays/{id}/wishes/{wishId}/approve', [BirthdayWishController::class, 'approve']);
    Route::patch('/birthdays/{id}/wishes/{wishId}/reject', [BirthdayWishController::class, 'reject']);
    Route::delete('/birthdays/{id}/wishes/{wishId}', [BirthdayWishController::class, 'destroy']);

    // Settings Management
    Route::get('/birthdays/{id}/settings', [BirthdaySettingsController::class, 'show']);
    Route::put('/birthdays/{id}/settings', [BirthdaySettingsController::class, 'update']);
});
