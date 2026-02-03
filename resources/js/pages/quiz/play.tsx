import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { useQuiz } from '@/contexts/QuizContext';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Timer } from '@/components/quiz/Timer';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle, Grid3x3 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function QuizPlay() {
    const { quizState, answerQuestion, nextQuestion, goToQuestion, submitQuiz, isLoading, error } = useQuiz();

    useEffect(() => {
        if (!quizState || !quizState.isActive) {
            router.visit('/quiz/dashboard');
        }
    }, [quizState]);

    if (!quizState || !quizState.isActive) {
        return null;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const currentAnswer = quizState.userAnswers[quizState.currentQuestionIndex];

    const handleAnswerSelect = (answer: string) => {
        answerQuestion(answer);
    };

    const handleNext = () => {
        nextQuestion();
    };

    const handlePrevious = () => {
        if (quizState.currentQuestionIndex > 0) {
            goToQuestion(quizState.currentQuestionIndex - 1);
        }
    };

    const handleQuit = () => {
        router.visit('/quiz/dashboard');
    };

    const handleSubmit = () => {
        submitQuiz();
    };

    const answeredCount = quizState.userAnswers.filter(a => a !== null).length;
    const unansweredCount = quizState.questions.length - answeredCount;

    return (
        <>
            <Head title="Quiz in Progress" />

            <div className="min-h-screen bg-[#FBFAF3] p-6">
                {/* Header */}
                <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between">
                    <div className="flex gap-2">
                        {/* Quit Button */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-2 border-[#E5E5E0] bg-white text-[#0F1511] hover:border-[#DE0F4D] hover:bg-white hover:text-[#DE0F4D]"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Quit
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-[#0F1511]">Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-[#AEB0B8]">
                                        Your progress will be saved and you can resume this quiz later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-2 border-[#E5E5E0]">Continue Quiz</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleQuit}
                                        className="bg-[#DE0F4D] hover:bg-[#c00d44]"
                                    >
                                        Quit
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Question Navigator */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-2 border-[#E5E5E0] bg-white text-[#0F1511] hover:border-[#E7FE55] hover:bg-[#E7FE55]"
                                >
                                    <Grid3x3 className="mr-2 h-4 w-4" />
                                    Questions
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-white w-80 sm:w-96">
                                <SheetHeader className="pb-4">
                                    <SheetTitle className="text-xl font-bold text-[#0F1511]">Question Navigator</SheetTitle>
                                </SheetHeader>
                                <div className="space-y-6">
                                    <div className="rounded-lg border-2 border-[#E5E5E0] bg-[#FBFAF3] p-4">
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[#AEB0B8]">Answered:</span>
                                                <span className="font-semibold text-[#17EC92]">{answeredCount} / {quizState.questions.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#AEB0B8]">Unanswered:</span>
                                                <span className="font-semibold text-[#F3F827]">{unansweredCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold text-[#AEB0B8]">Jump to Question</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                            {quizState.questions.map((_, index) => {
                                                const isAnswered = quizState.userAnswers[index] !== null;
                                                const isCurrent = index === quizState.currentQuestionIndex;

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => goToQuestion(index)}
                                                        className={cn(
                                                            "aspect-square w-full rounded-lg border-2 text-sm font-semibold transition-all",
                                                            isCurrent && "border-[#E7FE55] bg-[#E7FE55] text-[#0F1511] ring-2 ring-[#E7FE55] ring-offset-2",
                                                            !isCurrent && isAnswered && "border-[#17EC92] bg-[#17EC92]/10 text-[#17EC92] hover:bg-[#17EC92]/20",
                                                            !isCurrent && !isAnswered && "border-[#E5E5E0] bg-white text-[#AEB0B8] hover:border-[#E7FE55] hover:bg-[#FBFAF3]"
                                                        )}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Timer */}
                    <Timer timeRemaining={quizState.timeRemaining} />
                </div>

                {/* Progress Bar */}
                <div className="mx-auto mb-8 max-w-4xl">
                    <ProgressBar
                        current={quizState.currentQuestionIndex + 1}
                        total={quizState.questions.length}
                    />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mx-auto mb-6 max-w-4xl rounded-lg border-2 border-[#F3F827] bg-[#F3F827]/10 p-4">
                        <div className="flex items-center gap-2 text-[#0F1511]">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Question Card */}
                <div className="mx-auto flex justify-center">
                    <QuestionCard
                        question={currentQuestion}
                        questionNumber={quizState.currentQuestionIndex + 1}
                        totalQuestions={quizState.questions.length}
                        selectedAnswer={currentAnswer}
                        onAnswerSelect={handleAnswerSelect}
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between">
                    <Button
                        onClick={handlePrevious}
                        disabled={quizState.currentQuestionIndex === 0}
                        variant="outline"
                        className="border-2 border-[#E5E5E0] bg-white text-[#0F1511] hover:border-[#E7FE55] hover:bg-[#E7FE55] disabled:opacity-50"
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {quizState.currentQuestionIndex < quizState.questions.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                className="bg-[#E7FE55] text-[#0F1511] hover:bg-[#d4eb3f]"
                            >
                                Next Question
                            </Button>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        disabled={unansweredCount > 0}
                                        className="bg-[#17EC92] text-white hover:bg-[#14d182] disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={unansweredCount > 0 ? `Please answer all questions (${unansweredCount} remaining)` : ''}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Submit Quiz
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-[#0F1511]">Submit Quiz?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-[#AEB0B8]">
                                            You have answered all {quizState.questions.length} questions.
                                            Are you ready to submit?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-2 border-[#E5E5E0]">Review Answers</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleSubmit}
                                            className="bg-[#17EC92] hover:bg-[#14d182]"
                                        >
                                            Submit
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                        <div className="rounded-lg bg-white p-6 text-center">
                            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E5E5E0] border-t-[#E7FE55]"></div>
                            <p className="text-lg font-semibold text-[#0F1511]">Submitting quiz...</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
