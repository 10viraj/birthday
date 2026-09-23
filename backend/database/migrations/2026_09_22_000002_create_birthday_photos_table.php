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
        Schema::create('birthday_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('birthday_id')->constrained('birthdays')->onDelete('cascade');
            $table->text('image_path');
            $table->string('caption')->nullable();
            $table->text('description')->nullable();
            $table->date('taken_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('birthday_photos');
    }
};
