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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function session()
    {
        return $this->belongsTo(QuizSession::class, 'quiz_session_id');
    }

    /**
     * Prepare the model for JSON serialization.
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Add camelCase versions for frontend
        $array['totalQuestions'] = $this->total_questions;
        $array['correctAnswers'] = $this->correct_answers;
        $array['incorrectAnswers'] = $this->incorrect_answers;
        $array['timeTaken'] = $this->time_taken_seconds;
        $array['createdAt'] = $this->created_at;
        
        return $array;
    }
}
