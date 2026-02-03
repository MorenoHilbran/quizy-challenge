<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    protected $fillable = [
        'user_id',
        'quiz_data',
        'total_questions',
        'answered_questions',
        'score',
        'completed',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'quiz_data' => 'array',
        'completed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function result()
    {
        return $this->hasOne(QuizResult::class);
    }
}
