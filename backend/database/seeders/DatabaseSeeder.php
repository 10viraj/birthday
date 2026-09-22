<?php

namespace Database\Seeders;

use App\Enums\BirthdayStatus;
use App\Enums\BirthdayVisibility;
use App\Models\Birthday;
use App\Models\BirthdayMemory;
use App\Models\BirthdayPhoto;
use App\Models\BirthdaySetting;
use App\Models\BirthdayWish;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $user = User::updateOrCreate(
            ['email' => 'admin@birthdaybliss.com'],
            [
                'name' => 'Kavita Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // Create Default Sample Birthday Page for Kavita
        $birthday = Birthday::updateOrCreate(
            ['slug' => 'kavita-special'],
            [
                'user_id' => $user->id,
                'name' => 'Kavita',
                'birth_date' => now()->addDays(2)->format('Y-m-d'), // 2 days from now for active countdown demonstration
                'timezone' => 'UTC',
                'profile_image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'headline' => 'To the most incredible soul in the universe ✨',
                'birthday_message' => 'Wishing you a year filled with endless laughter, boundless adventures, and all the magic you bring into the world!',
                'letter_title' => 'Dearest Kavita,',
                'letter_content' => "On your special day, I wanted to create something truly magical to celebrate you.\n\nFrom our late-night conversations to all the unforgettable adventures we've shared, every single moment with you is a treasure.\n\nMay this upcoming year bring you unbounded happiness, inner peace, and all your biggest dreams fulfilled. Keep shining bright like you always do!",
                'signature' => 'With endless love & warmth ❤️',
                'theme' => 'pink-purple',
                'custom_colors' => [
                    'primary' => '#FF6FAE',
                    'secondary' => '#C7A7FF',
                    'accent' => '#FFD166',
                    'background' => '#160B28',
                ],
                'music_path' => 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-112282.mp3',
                'visibility' => BirthdayVisibility::PUBLIC,
                'status' => BirthdayStatus::PUBLISHED,
                'published_at' => now(),
            ]
        );

        // Also create fallback slug 'kavita' and 'viraj-special' for compatibility
        foreach (['kavita', 'viraj-special'] as $slug) {
            Birthday::updateOrCreate(
                ['slug' => $slug],
                [
                    'user_id' => $user->id,
                    'name' => 'Kavita',
                    'birth_date' => now()->addDays(2)->format('Y-m-d'),
                    'timezone' => 'UTC',
                    'profile_image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                    'headline' => 'To the most incredible soul in the universe ✨',
                    'birthday_message' => 'Wishing you a year filled with endless laughter, boundless adventures, and all the magic you bring into the world!',
                    'letter_title' => 'Dearest Kavita,',
                    'letter_content' => "On your special day, I wanted to create something truly magical to celebrate you.\n\nFrom our late-night conversations to all the unforgettable adventures we've shared, every single moment with you is a treasure.\n\nMay this upcoming year bring you unbounded happiness, inner peace, and all your biggest dreams fulfilled. Keep shining bright like you always do!",
                    'signature' => 'With endless love & warmth ❤️',
                    'theme' => 'pink-purple',
                    'custom_colors' => [
                        'primary' => '#FF6FAE',
                        'secondary' => '#C7A7FF',
                        'accent' => '#FFD166',
                        'background' => '#160B28',
                    ],
                    'music_path' => 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-112282.mp3',
                    'visibility' => BirthdayVisibility::PUBLIC,
                    'status' => BirthdayStatus::PUBLISHED,
                    'published_at' => now(),
                ]
            );
        }

        // Settings
        BirthdaySetting::updateOrCreate(
            ['birthday_id' => $birthday->id],
            [
                'countdown_enabled' => true,
                'cake_animation_enabled' => true,
                'music_enabled' => true,
                'gallery_enabled' => true,
                'timeline_enabled' => true,
                'surprise_enabled' => true,
                'wishes_enabled' => true,
            ]
        );

        // Photos
        $photos = [
            [
                'image_path' => 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Golden Hour Smiles 🌅',
                'description' => 'Captured during our summer beach stroll as the sunset turned the sky golden.',
                'taken_at' => '2025-07-15',
                'sort_order' => 1,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
                'caption' => 'The Grand Celebration 🎉',
                'description' => 'A sweet memory from last year’s surprising birthday party surrounded by loved ones.',
                'taken_at' => '2025-09-22',
                'sort_order' => 2,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Stargazing Night ✨',
                'description' => 'Looking up at the constellations on a chilly autumn night.',
                'taken_at' => '2025-10-12',
                'sort_order' => 3,
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Laughter & Confetti 💖',
                'description' => 'Pure happiness captured in a single frame.',
                'taken_at' => '2025-12-31',
                'sort_order' => 4,
            ],
        ];

        foreach ($photos as $photoData) {
            BirthdayPhoto::create(array_merge(['birthday_id' => $birthday->id], $photoData));
        }

        // Memories Timeline
        $memories = [
            [
                'title' => 'The Day We First Met ☕',
                'description' => 'It all started with a cozy coffee chat that lasted over 4 hours! We lost track of time talking about everything under the sun.',
                'memory_date' => '2023-04-10',
                'image_path' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 1,
            ],
            [
                'title' => 'Mountain Hike Adventure ⛰️',
                'description' => 'Reaching the mountain peak at dawn after a long trek. The view was breathtaking, but your smile was unforgettable.',
                'memory_date' => '2024-06-18',
                'image_path' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 2,
            ],
            [
                'title' => 'Spontaneous Road Trip 🚗💨',
                'description' => 'Drove down the coast with the windows down, singing along to our favorite songs without a care in the world.',
                'memory_date' => '2024-11-05',
                'image_path' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
                'sort_order' => 3,
            ],
        ];

        foreach ($memories as $memoryData) {
            BirthdayMemory::create(array_merge(['birthday_id' => $birthday->id], $memoryData));
        }

        // Wishes
        $wishes = [
            [
                'visitor_name' => 'Sophia M.',
                'message' => 'Happy Birthday Kavita! 🎂 May your year be overflowing with happiness, success, and amazing journeys!',
                'status' => 'approved',
            ],
            [
                'visitor_name' => 'Liam & Emma',
                'message' => 'Wishing you the happiest of birthdays Kavita! Keep spreading your infectious joy everywhere you go ✨',
                'status' => 'approved',
            ],
            [
                'visitor_name' => 'Aarav Patel',
                'message' => 'Happy Birthday Kavita! Party hard and have a fabulous year ahead 🎉🍻',
                'status' => 'approved',
            ],
            [
                'visitor_name' => 'Mystery Friend',
                'message' => 'Sending you the warmest birthday hugs, Kavita! Hope you enjoy this lovely surprise page ❤️',
                'status' => 'pending',
            ],
        ];

        foreach ($wishes as $wishData) {
            BirthdayWish::create(array_merge(['birthday_id' => $birthday->id], $wishData));
        }
    }
}
