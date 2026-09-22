<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BirthdayWish extends Model
{
    use HasFactory;

    protected $fillable = [
        'birthday_id',
        'visitor_name',
        'message',
        'status',
    ];

    public function birthday(): BelongsTo
    {
        return $this->belongsTo(Birthday::class);
    }
}
