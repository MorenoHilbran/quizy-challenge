<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $fillable = [
        'user_id',
        'quiz_session_id',
        'score',
        'total_questions',
        'correct_answers',
        'incorrect_answers',
        'time_taken_seconds',
        'category',
        'difficulty',
    ];

    protected $casts = [
        'score' => 'integer',
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'incorrect_answers' => 'integer',
        'time_taken_seconds' => 'integer',
    ];

    protected $appends = [
        'totalQuestions',
        'correctAnswers',
        'incorrectAnswers',
        'timeTaken',
    ];

    // Accessors for camelCase
    public function getTotalQuestionsAttribute()
    {
        return $this->total_questions;
    }

    public function getCorrectAnswersAttribute()
    {
        return $this->correct_answers;
    }

    public function getIncorrectAnswersAttribute()
    {
        return $this->incorrect_answers;
    }

    public function getTimeTakenAttribute()
    {
        return $this->time_taken_seconds;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function session()
    {
        return $this->belongsTo(QuizSession::class, 'quiz_session_id');
    }
}
