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
        Schema::create('birthdays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->date('birth_date');
            $table->string('timezone')->default('UTC');
            $table->string('profile_image')->nullable();
            $table->string('headline')->nullable();
            $table->text('birthday_message')->nullable();
            $table->string('letter_title')->nullable();
            $table->text('letter_content')->nullable();
            $table->string('signature')->nullable();
            $table->string('theme')->default('pink-purple');
            $table->json('custom_colors')->nullable();
            $table->string('music_path')->nullable();
            $table->string('visibility')->default('public'); // public, private, password_protected
            $table->string('password_hash')->nullable();
            $table->string('status')->default('published'); // draft, published
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('birthdays');
    }
};
