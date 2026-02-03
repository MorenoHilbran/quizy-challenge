import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/quizHelpers';
import { PlayCircle, Home, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { QuizResult } from '@/types/quiz';

interface ResultsProps {
    sessionId: number;
}

export default function QuizResults({ sessionId }: ResultsProps) {
    const [result, setResult] = useState<QuizResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/quiz/results?quiz_session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.data && data.data.length > 0) {
                    setResult(data.data[0]);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching result:', err);
                setIsLoading(false);
            });
    }, [sessionId]);

    if (isLoading) {
        return (
            <AppLayout>
                <Head title="Loading Results..." />
                <div className="flex min-h-screen items-center justify-center bg-[#FBFAF3]">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#E5E5E0] border-t-[#E7FE55]"></div>
                        <p className="text-xl text-[#0F1511]">Loading your results...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!result) {
        return (
            <AppLayout>
                <Head title="Results Not Found" />
                <div className="flex min-h-screen items-center justify-center bg-[#FBFAF3]">
                    <div className="text-center">
                        <p className="mb-4 text-xl text-[#0F1511]">Results not found</p>
                        <Button onClick={() => router.visit('/quiz/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const scorePercentage = result.score;
    const getScoreMessage = (score: number) => {
        if (score === 100) return '🎉 Perfect Score! Outstanding!';
        if (score >= 90) return '🌟 Excellent work!';
        if (score >= 80) return '👏 Great job!';
        if (score >= 70) return '👍 Good effort!';
        if (score >= 60) return '💪 Not bad!';
        if (score >= 50) return '📚 Keep practicing!';
        return '🎯 Try again!';
    };

    return (
        <AppLayout>
            <Head title="Quiz Results" />

            <div className="min-h-screen bg-[#FBFAF3] p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Celebration Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-block animate-bounce">
                            <Trophy className="h-20 w-20 text-[#E7FE55]" />
                        </div>
                        <h1 className="mb-2 text-5xl font-bold text-[#0F1511]">
                            Quiz Complete!
                        </h1>
                        <p className="text-2xl text-[#AEB0B8]">{getScoreMessage(scorePercentage)}</p>
                    </div>

                    {/* Score Card */}
                    <div className="mb-8 rounded-2xl border-2 border-[#E5E5E0] bg-white p-8 text-center">
                        <p className="mb-2 text-lg text-[#AEB0B8]">Your Score</p>
                        <p className="mb-6 text-7xl font-bold text-[#0F1511]">
                            {scorePercentage}%
                        </p>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border-2 border-[#E5E5E0] bg-[#FBFAF3] p-4">
                                <div className="flex items-center justify-center gap-2 text-[#17EC92]">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{result.correctAnswers}</span>
                                </div>
                                <p className="mt-1 text-sm text-[#AEB0B8]">Correct</p>
                            </div>
                            <div className="rounded-lg border-2 border-[#E5E5E0] bg-[#FBFAF3] p-4">
                                <div className="flex items-center justify-center gap-2 text-[#DE0F4D]">
                                    <XCircle className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{result.incorrectAnswers}</span>
                                </div>
                                <p className="mt-1 text-sm text-[#AEB0B8]">Incorrect</p>
                            </div>
                            <div className="rounded-lg border-2 border-[#E5E5E0] bg-[#FBFAF3] p-4">
                                <div className="flex items-center justify-center gap-2 text-[#0F1511]">
                                    <Clock className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{formatTime(result.timeTaken)}</span>
                                </div>
                                <p className="mt-1 text-sm text-[#AEB0B8]">Time Taken</p>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Details */}
                    <div className="mb-8 rounded-2xl border-2 border-[#E5E5E0] bg-white p-6">
                        <h3 className="mb-4 text-xl font-bold text-[#0F1511]">Quiz Details</h3>
                        <div className="grid gap-3 text-[#0F1511]">
                            <div className="flex justify-between">
                                <span className="text-[#AEB0B8]">Total Questions:</span>
                                <span className="font-semibold">{result.totalQuestions}</span>
                            </div>
                            {result.category && (
                                <div className="flex justify-between">
                                    <span className="text-[#AEB0B8]">Category:</span>
                                    <span className="font-semibold">{result.category}</span>
                                </div>
                            )}
                            {result.difficulty && (
                                <div className="flex justify-between">
                                    <span className="text-[#AEB0B8]">Difficulty:</span>
                                    <span className="font-semibold capitalize">{result.difficulty}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[#AEB0B8]">Accuracy:</span>
                                <span className="font-semibold">
                                    {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            onClick={() => router.visit('/quiz/dashboard')}
                            className="flex-1 bg-[#E7FE55] text-[#0F1511] hover:bg-[#d4eb3f]"
                            size="lg"
                        >
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Play Again
                        </Button>
                        <Button
                            onClick={() => router.visit('/quiz/history')}
                            variant="outline"
                            className="flex-1 border-2 border-[#E5E5E0] text-[#0F1511] hover:bg-[#FBFAF3]"
                            size="lg"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            View History
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
