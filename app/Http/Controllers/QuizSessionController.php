<?php

namespace App\Http\Controllers;

use App\Models\QuizSession;
use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizSessionController extends Controller
{
    /**
     * Create a new quiz session
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_data' => 'required|array',
            'total_questions' => 'required|integer|min:1',
            'settings' => 'nullable|array',
        ]);

        $session = QuizSession::create([
            'user_id' => Auth::id(),
            'quiz_data' => $validated['quiz_data'],
            'total_questions' => $validated['total_questions'],
            'answered_questions' => 0,
            'completed' => false,
            'started_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'session' => $session,
        ]);
    }

    /**
     * Update quiz session progress
     */
    public function update(Request $request, QuizSession $session)
    {
        // Ensure user owns this session
        if ($session->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'answered_questions' => 'required|integer|min:0',
            'quiz_data' => 'nullable|array',
        ]);

        $session->update($validated);

        return response()->json([
            'success' => true,
            'session' => $session,
        ]);
    }

    /**
     * Get active quiz session for current user
     */
    public function show()
    {
        $session = QuizSession::where('user_id', Auth::id())
            ->where('completed', false)
            ->latest()
            ->first();

        return response()->json([
            'session' => $session,
        ]);
    }

    /**
     * Complete quiz session and save result
     */
    public function complete(Request $request, QuizSession $session)
    {
        // Ensure user owns this session
        if ($session->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'correct_answers' => 'required|integer|min:0',
            'incorrect_answers' => 'required|integer|min:0',
            'time_taken_seconds' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'difficulty' => 'nullable|string',
        ]);

        // Update session
        $session->update([
            'score' => $validated['score'],
            'completed' => true,
            'completed_at' => now(),
            'answered_questions' => $validated['correct_answers'] + $validated['incorrect_answers'],
        ]);

        // Create result record
        $result = QuizResult::create([
            'user_id' => Auth::id(),
            'quiz_session_id' => $session->id,
            'score' => $validated['score'],
            'total_questions' => $session->total_questions,
            'correct_answers' => $validated['correct_answers'],
            'incorrect_answers' => $validated['incorrect_answers'],
            'time_taken_seconds' => $validated['time_taken_seconds'],
            'category' => $validated['category'] ?? null,
            'difficulty' => $validated['difficulty'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'session' => $session,
            'result' => $result,
        ]);
    }
}
