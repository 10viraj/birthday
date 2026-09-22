<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BirthdayMemory extends Model
{
    use HasFactory;

    protected $fillable = [
        'birthday_id',
        'title',
        'description',
        'memory_date',
        'image_path',
        'sort_order',
    ];

    protected $casts = [
        'memory_date' => 'date',
        'sort_order' => 'integer',
    ];

    public function birthday(): BelongsTo
    {
        return $this->belongsTo(Birthday::class);
    }
}
