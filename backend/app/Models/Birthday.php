<?php

namespace App\Models;

use App\Enums\BirthdayStatus;
use App\Enums\BirthdayVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Birthday extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'birth_date',
        'timezone',
        'profile_image',
        'headline',
        'birthday_message',
        'letter_title',
        'letter_content',
        'signature',
        'theme',
        'custom_colors',
        'music_path',
        'visibility',
        'password_hash',
        'status',
        'published_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'custom_colors' => 'array',
        'published_at' => 'datetime',
        'status' => BirthdayStatus::class,
        'visibility' => BirthdayVisibility::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(BirthdayPhoto::class)->orderBy('sort_order', 'asc');
    }

    public function memories(): HasMany
    {
        return $this->hasMany(BirthdayMemory::class)->orderBy('sort_order', 'asc');
    }

    public function wishes(): HasMany
    {
        return $this->hasMany(BirthdayWish::class)->latest();
    }

    public function settings(): HasOne
    {
        return $this->hasOne(BirthdaySetting::class);
    }
}
