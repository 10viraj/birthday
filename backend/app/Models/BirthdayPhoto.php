<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BirthdayPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'birthday_id',
        'image_path',
        'caption',
        'description',
        'taken_at',
        'sort_order',
    ];

    protected $casts = [
        'taken_at' => 'date',
        'sort_order' => 'integer',
    ];

    public function birthday(): BelongsTo
    {
        return $this->belongsTo(Birthday::class);
    }
}
