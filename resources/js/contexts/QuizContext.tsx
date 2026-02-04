import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { Question, QuizSettings, QuizState, QuizResult } from '@/types/quiz';
import { fetchQuestions } from '@/lib/triviaApi';
import {
    saveQuizState,
    loadQuizState,
    clearQuizState,
    saveSessionId,
    getSessionId,
} from '@/lib/quizStorage';
import { calculateScore, formatTime } from '@/lib/quizHelpers';

const QUIZ_DURATION = 300; // 5 minutes in seconds

interface QuizContextType {
    quizState: QuizState | null;
    startQuiz: (settings: QuizSettings) => Promise<void>;
    answerQuestion: (answer: string) => void;
    nextQuestion: () => void;
    goToQuestion: (index: number) => void;
    submitQuiz: () => Promise<void>;
    resumeQuiz: () => void;
    resetQuiz: () => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
    const [quizState, setQuizState] = useState<QuizState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load quiz state from localStorage on mount
    useEffect(() => {
        const savedState = loadQuizState();
        if (savedState && savedState.isActive) {
            setQuizState(savedState);
        }
    }, []);

    // Save quiz state to localStorage whenever it changes
    useEffect(() => {
        if (quizState && quizState.isActive) {
            saveQuizState(quizState);
        }
    }, [quizState]);

    // Timer effect
    useEffect(() => {
        if (!quizState || !quizState.isActive || quizState.timeRemaining <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setQuizState((prev) => {
                if (!prev || !prev.isActive) return prev;

                const newTimeRemaining = prev.timeRemaining - 1;

                if (newTimeRemaining <= 0) {
                    // Time's up - auto submit
                    submitQuiz();
                    return { ...prev, timeRemaining: 0, isActive: false };
                }

                return { ...prev, timeRemaining: newTimeRemaining };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [quizState?.isActive, quizState?.timeRemaining]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const startQuiz = useCallback(async (settings: QuizSettings) => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch questions from API
            const questions = await fetchQuestions(settings);

            // Create quiz session on server
            const response = await fetch('/api/quiz/sessions', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    quiz_data: {
                        questions,
                        settings,
                    },
                    total_questions: questions.length,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create quiz session');
            }

            const data = await response.json();
            const sessionId = data.session.id;

            // Save session ID
            saveSessionId(sessionId);

            // Initialize quiz state
            const newState: QuizState = {
                sessionId,
                questions,
                currentQuestionIndex: 0,
                userAnswers: new Array(questions.length).fill(null),
                timeRemaining: QUIZ_DURATION,
                isActive: true,
                settings,
                startedAt: new Date().toISOString(),
            };

            setQuizState(newState);
            saveQuizState(newState);

            // Navigate to quiz play page
            router.visit('/quiz/play');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start quiz';
            setError(errorMessage);
            console.error('Error starting quiz:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const answerQuestion = useCallback((answer: string) => {
        setQuizState((prev) => {
            if (!prev) return prev;

            const newAnswers = [...prev.userAnswers];
            newAnswers[prev.currentQuestionIndex] = answer;

            const newState = {
                ...prev,
                userAnswers: newAnswers,
            };

            saveQuizState(newState);
            return newState;
        });
    }, []);

    const nextQuestion = useCallback(() => {
        setQuizState((prev) => {
            if (!prev) return prev;

            const nextIndex = prev.currentQuestionIndex + 1;

            // If this was the last question, don't auto-submit
            if (nextIndex >= prev.questions.length) {
                return prev;
            }

            const newState = {
                ...prev,
                currentQuestionIndex: nextIndex,
            };

            saveQuizState(newState);
            return newState;
        });
    }, []);

    const goToQuestion = useCallback((index: number) => {
        setQuizState((prev) => {
            if (!prev) return prev;

            // Validate index
            if (index < 0 || index >= prev.questions.length) {
                return prev;
            }

            const newState = {
                ...prev,
                currentQuestionIndex: index,
            };

            saveQuizState(newState);
            return newState;
        });
    }, []);

    const submitQuiz = useCallback(async () => {
        if (!quizState) return;

        setIsLoading(true);

        try {
            const timeTaken = QUIZ_DURATION - quizState.timeRemaining;
            const result = calculateScore(quizState.questions, quizState.userAnswers);

            // Submit to server
            const response = await fetch(`/api/quiz/sessions/${quizState.sessionId}/complete`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    score: result.score,
                    correct_answers: result.correctAnswers,
                    incorrect_answers: result.incorrectAnswers,
                    time_taken_seconds: timeTaken,
                    category: quizState.settings.category,
                    difficulty: quizState.settings.difficulty,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            // Clear quiz state
            setQuizState((prev) => prev ? { ...prev, isActive: false } : null);
            clearQuizState();

            // Navigate to results page
            router.visit(`/quiz/results/${quizState.sessionId}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
            setError(errorMessage);
            console.error('Error submitting quiz:', err);
        } finally {
            setIsLoading(false);
        }
    }, [quizState]);

    const resumeQuiz = useCallback(() => {
        const savedState = loadQuizState();
        if (savedState && savedState.isActive) {
            setQuizState(savedState);
            router.visit('/quiz/play');
        }
    }, []);

    const resetQuiz = useCallback(() => {
        setQuizState(null);
        clearQuizState();
        setError(null);
    }, []);

    const value: QuizContextType = {
        quizState,
        startQuiz,
        answerQuestion,
        nextQuestion,
        goToQuestion,
        submitQuiz,
        resumeQuiz,
        resetQuiz,
        isLoading,
        error,
        clearError,
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextType {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
