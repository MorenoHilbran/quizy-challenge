<?php

namespace App\Http\Controllers;

use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuizResultController extends Controller
{
    /**
     * Get user's quiz history
     */
    public function index(Request $request)
    {
        $results = QuizResult::where('user_id', Auth::id())
            ->with('session')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($results);
    }

    /**
     * Get specific quiz result
     */
    public function show(QuizResult $result)
    {
        // Ensure user owns this result
        if ($result->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $result->load('session');

        return response()->json($result);
    }

    /**
     * Get user statistics
     */
    public function stats()
    {
        $userId = Auth::id();

        $stats = [
            'total_quizzes' => QuizResult::where('user_id', $userId)->count(),
            'total_questions_answered' => QuizResult::where('user_id', $userId)->sum('total_questions'),
            'total_correct_answers' => QuizResult::where('user_id', $userId)->sum('correct_answers'),
            'average_score' => QuizResult::where('user_id', $userId)->avg('score'),
            'best_score' => QuizResult::where('user_id', $userId)->max('score'),
            'total_time_spent' => QuizResult::where('user_id', $userId)->sum('time_taken_seconds'),
            'by_difficulty' => QuizResult::where('user_id', $userId)
                ->select('difficulty', DB::raw('count(*) as count'), DB::raw('avg(score) as avg_score'))
                ->whereNotNull('difficulty')
                ->groupBy('difficulty')
                ->get(),
            'recent_results' => QuizResult::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}
