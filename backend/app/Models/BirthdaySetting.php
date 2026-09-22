<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BirthdaySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'birthday_id',
        'countdown_enabled',
        'cake_animation_enabled',
        'music_enabled',
        'gallery_enabled',
        'timeline_enabled',
        'surprise_enabled',
        'wishes_enabled',
        'settings',
    ];

    protected $casts = [
        'countdown_enabled' => 'boolean',
        'cake_animation_enabled' => 'boolean',
        'music_enabled' => 'boolean',
        'gallery_enabled' => 'boolean',
        'timeline_enabled' => 'boolean',
        'surprise_enabled' => 'boolean',
        'wishes_enabled' => 'boolean',
        'settings' => 'array',
    ];

    public function birthday(): BelongsTo
    {
        return $this->belongsTo(Birthday::class);
    }
}
