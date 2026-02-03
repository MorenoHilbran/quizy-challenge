<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return redirect('/quiz/dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Quiz routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('quiz/dashboard', function () {
        return Inertia::render('quiz/dashboard');
    })->name('quiz.dashboard');
    
    Route::get('quiz/play', function () {
        return Inertia::render('quiz/play');
    })->name('quiz.play');
    
    Route::get('quiz/results/{session}', function ($session) {
        return Inertia::render('quiz/results', ['sessionId' => $session]);
    })->name('quiz.results');
    
    Route::get('quiz/history', function () {
        return Inertia::render('quiz/history');
    })->name('quiz.history');
    
    // API endpoints
    Route::post('api/quiz/sessions', [App\Http\Controllers\QuizSessionController::class, 'store'])->name('api.quiz.sessions.store');
    Route::patch('api/quiz/sessions/{session}', [App\Http\Controllers\QuizSessionController::class, 'update'])->name('api.quiz.sessions.update');
    Route::get('api/quiz/sessions/active', [App\Http\Controllers\QuizSessionController::class, 'show'])->name('api.quiz.sessions.active');
    Route::post('api/quiz/sessions/{session}/complete', [App\Http\Controllers\QuizSessionController::class, 'complete'])->name('api.quiz.sessions.complete');
    
    Route::get('api/quiz/results', [App\Http\Controllers\QuizResultController::class, 'index'])->name('api.quiz.results.index');
    Route::get('api/quiz/results/{result}', [App\Http\Controllers\QuizResultController::class, 'show'])->name('api.quiz.results.show');
    Route::get('api/quiz/stats', [App\Http\Controllers\QuizResultController::class, 'stats'])->name('api.quiz.stats');
});


require __DIR__.'/settings.php';
