import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ResumeModal } from '@/components/quiz/ResumeModal';
import { useQuiz } from '@/contexts/QuizContext';
import { fetchCategories } from '@/lib/triviaApi';
import { hasActiveQuiz, loadQuizState } from '@/lib/quizStorage';
import type { QuizSettings, TriviaCategory } from '@/types/quiz';
import { PlayCircle, Trophy, History, Brain } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function QuizDashboard() {
    const { auth } = usePage().props as any;
    const { startQuiz, resumeQuiz, resetQuiz, isLoading } = useQuiz();

    const [showResumeModal, setShowResumeModal] = useState(false);
    const [categories, setCategories] = useState<TriviaCategory[]>([]);
    const [settings, setSettings] = useState<QuizSettings>({
        amount: 10,
        category: undefined,
        difficulty: undefined,
        type: undefined,
    });

    useEffect(() => {
        if (hasActiveQuiz()) {
            setShowResumeModal(true);
        }
        fetchCategories().then(setCategories);
    }, []);

    const handleStartQuiz = async () => {
        await startQuiz(settings);
    };

    const handleResume = () => {
        setShowResumeModal(false);
        resumeQuiz();
    };

    const handleStartNew = () => {
        setShowResumeModal(false);
        resetQuiz();
    };

    const savedState = loadQuizState();
    const answeredQuestions = savedState?.userAnswers.filter(a => a !== null).length || 0;
    const totalQuestions = savedState?.questions.length || 0;

    return (
        <AppLayout>
            <Head title="Quiz Dashboard" />

            <ResumeModal
                isOpen={showResumeModal}
                onResume={handleResume}
                onStartNew={handleStartNew}
                answeredQuestions={answeredQuestions}
                totalQuestions={totalQuestions}
            />

            <div className="min-h-screen bg-[#FBFAF3] p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-[#E7FE55] p-4">
                            <Brain className="h-12 w-12 text-[#0F1511]" />
                        </div>
                        <h1 className="mb-3 text-5xl font-bold text-[#0F1511]">
                            Quizy
                        </h1>
                        <p className="text-xl text-[#AEB0B8]">
                            Hey {auth.user.name}, ready to test your knowledge?
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="mb-8 grid gap-4 md:grid-cols-2">
                        <Link
                            href="/quiz/history"
                            className="group rounded-xl border-2 border-[#E5E5E0] bg-white p-6 transition-all hover:border-[#E7FE55] hover:shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-[#FBFAF3] p-3">
                                    <History className="h-8 w-8 text-[#0F1511]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#AEB0B8]">View Your</p>
                                    <p className="text-2xl font-bold text-[#0F1511]">Quiz History</p>
                                </div>
                            </div>
                        </Link>

                        <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-[#E7FE55] p-3">
                                    <Trophy className="h-8 w-8 text-[#0F1511]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#AEB0B8]">Your Best</p>
                                    <p className="text-2xl font-bold text-[#0F1511]">Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Configuration */}
                    <div className="rounded-2xl border-2 border-[#E5E5E0] bg-white p-8">
                        <h2 className="mb-6 text-2xl font-bold text-[#0F1511]">
                            Configure Your Quiz
                        </h2>

                        <div className="space-y-6">
                            {/* Number of Questions */}
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-[#0F1511]">
                                    Number of Questions
                                </Label>
                                <Select
                                    value={settings.amount.toString()}
                                    onValueChange={(value) =>
                                        setSettings({ ...settings, amount: parseInt(value) })
                                    }
                                >
                                    <SelectTrigger id="amount">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 Questions</SelectItem>
                                        <SelectItem value="10">10 Questions</SelectItem>
                                        <SelectItem value="15">15 Questions</SelectItem>
                                        <SelectItem value="20">20 Questions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-[#0F1511]">
                                    Category
                                </Label>
                                <Select
                                    value={settings.category}
                                    onValueChange={(value) =>
                                        setSettings({ ...settings, category: value === 'any' ? undefined : value })
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Any Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Category</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-2">
                                <Label htmlFor="difficulty" className="text-[#0F1511]">
                                    Difficulty
                                </Label>
                                <Select
                                    value={settings.difficulty || 'any'}
                                    onValueChange={(value) =>
                                        setSettings({ ...settings, difficulty: value === 'any' ? undefined : value as any })
                                    }
                                >
                                    <SelectTrigger id="difficulty">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Difficulty</SelectItem>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Question Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-[#0F1511]">
                                    Question Type
                                </Label>
                                <Select
                                    value={settings.type || 'any'}
                                    onValueChange={(value) =>
                                        setSettings({ ...settings, type: value === 'any' ? undefined : value as any })
                                    }
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Type</SelectItem>
                                        <SelectItem value="multiple">Multiple Choice</SelectItem>
                                        <SelectItem value="boolean">True / False</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Button */}
                            <Button
                                onClick={handleStartQuiz}
                                disabled={isLoading}
                                className="w-full bg-[#E7FE55] py-6 text-lg font-bold text-[#0F1511] hover:bg-[#d4eb3f]"
                                size="lg"
                            >
                                {isLoading ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        <PlayCircle className="mr-2 h-6 w-6" />
                                        Start Quiz
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
