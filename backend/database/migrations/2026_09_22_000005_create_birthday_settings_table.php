<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('birthday_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('birthday_id')->unique()->constrained('birthdays')->onDelete('cascade');
            $table->boolean('countdown_enabled')->default(true);
            $table->boolean('cake_animation_enabled')->default(true);
            $table->boolean('music_enabled')->default(true);
            $table->boolean('gallery_enabled')->default(true);
            $table->boolean('timeline_enabled')->default(true);
            $table->boolean('surprise_enabled')->default(true);
            $table->boolean('wishes_enabled')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('birthday_settings');
    }
};
