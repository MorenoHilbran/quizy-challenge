import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatTime } from '@/lib/quizHelpers';
import { PlayCircle, Trophy, TrendingUp, Target } from 'lucide-react';
import type { QuizResult } from '@/types/quiz';

export default function QuizHistory() {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/quiz/results').then((res) => res.json()),
            fetch('/api/quiz/stats').then((res) => res.json()),
        ])
            .then(([resultsData, statsData]) => {
                setResults(resultsData.data || []);
                setStats(statsData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching history:', err);
                setIsLoading(false);
            });
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[#17EC92]';
        if (score >= 60) return 'text-[#F3F827]';
        return 'text-[#DE0F4D]';
    };

    const getDifficultyColor = (difficulty: string) => {
        if (difficulty === 'easy') return 'text-[#17EC92]';
        if (difficulty === 'medium') return 'text-[#F3F827]';
        return 'text-[#DE0F4D]';
    };

    if (isLoading) {
        return (
            <AppLayout>
                <Head title="Quiz History" />
                <div className="flex min-h-screen items-center justify-center bg-[#FBFAF3]">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#E5E5E0] border-t-[#E7FE55]"></div>
                        <p className="text-lg font-semibold text-[#0F1511]">Loading history...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Quiz History" />

            <div className="min-h-screen bg-[#FBFAF3] p-6">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-4xl font-bold text-[#0F1511]">
                            Quiz History
                        </h1>
                        <p className="text-lg text-[#AEB0B8]">
                            Track your progress and review past quizzes
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="mb-8 grid gap-4 md:grid-cols-4">
                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#FBFAF3] p-2">
                                        <Trophy className="h-6 w-6 text-[#0F1511]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#AEB0B8]">Total Quizzes</p>
                                        <p className="text-2xl font-bold text-[#0F1511]">
                                            {stats.total_quizzes || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#17EC92]/10 p-2">
                                        <TrendingUp className="h-6 w-6 text-[#17EC92]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#AEB0B8]">Average Score</p>
                                        <p className="text-2xl font-bold text-[#0F1511]">
                                            {stats.average_score ? Math.round(stats.average_score) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#E7FE55]/20 p-2">
                                        <Trophy className="h-6 w-6 text-[#0F1511]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#AEB0B8]">Best Score</p>
                                        <p className="text-2xl font-bold text-[#0F1511]">
                                            {stats.best_score || 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#FBFAF3] p-2">
                                        <Target className="h-6 w-6 text-[#0F1511]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#AEB0B8]">Questions</p>
                                        <p className="text-2xl font-bold text-[#0F1511]">
                                            {stats.total_questions_answered || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="rounded-2xl border-2 border-[#E5E5E0] bg-white p-6">
                        <h2 className="mb-4 text-2xl font-bold text-[#0F1511]">Recent Quizzes</h2>

                        {results.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="mb-4 text-lg text-[#AEB0B8]">
                                    No quiz history yet
                                </p>
                                <Button
                                    onClick={() => router.visit('/quiz/dashboard')}
                                    className="bg-[#E7FE55] text-[#0F1511] hover:bg-[#d4eb3f]"
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Take Your First Quiz
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-[#E5E5E0] hover:bg-[#FBFAF3]">
                                            <TableHead className="text-[#AEB0B8]">Date</TableHead>
                                            <TableHead className="text-[#AEB0B8]">Score</TableHead>
                                            <TableHead className="text-[#AEB0B8]">Questions</TableHead>
                                            <TableHead className="text-[#AEB0B8]">Correct</TableHead>
                                            <TableHead className="text-[#AEB0B8]">Time</TableHead>
                                            <TableHead className="text-[#AEB0B8]">Difficulty</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => (
                                            <TableRow
                                                key={result.id}
                                                className="border-[#E5E5E0] hover:bg-[#FBFAF3]"
                                            >
                                                <TableCell className="text-[#0F1511]">
                                                    {result.createdAt
                                                        ? new Date(result.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`font-bold ${getScoreColor(result.score)}`}>
                                                        {result.score}%
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-[#0F1511]">
                                                    {result.totalQuestions}
                                                </TableCell>
                                                <TableCell className="text-[#0F1511]">
                                                    {result.correctAnswers}/{result.totalQuestions}
                                                </TableCell>
                                                <TableCell className="text-[#0F1511]">
                                                    {formatTime(result.timeTaken)}
                                                </TableCell>
                                                <TableCell>
                                                    {result.difficulty ? (
                                                        <span className={`font-medium capitalize ${getDifficultyColor(result.difficulty)}`}>
                                                            {result.difficulty}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[#AEB0B8]">Mixed</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <Button
                            onClick={() => router.visit('/quiz/dashboard')}
                            variant="outline"
                            className="border-2 border-[#E5E5E0] text-[#0F1511] hover:bg-[#FBFAF3]"
                            size="lg"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
