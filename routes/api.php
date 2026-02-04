<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizSessionController;
use App\Http\Controllers\QuizResultController;

Route::middleware('auth:web')->group(function () {
    // Quiz Session endpoints
    Route::post('quiz/sessions', [QuizSessionController::class, 'store'])->name('api.quiz.sessions.store');
    Route::patch('quiz/sessions/{session}', [QuizSessionController::class, 'update'])->name('api.quiz.sessions.update');
    Route::get('quiz/sessions/active', [QuizSessionController::class, 'show'])->name('api.quiz.sessions.active');
    Route::post('quiz/sessions/{session}/complete', [QuizSessionController::class, 'complete'])->name('api.quiz.sessions.complete');
    
    // Quiz Results endpoints
    Route::get('quiz/results', [QuizResultController::class, 'index'])->name('api.quiz.results.index');
    Route::get('quiz/results/{result}', [QuizResultController::class, 'show'])->name('api.quiz.results.show');
    Route::get('quiz/stats', [QuizResultController::class, 'stats'])->name('api.quiz.stats');
});
