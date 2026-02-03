import type { Question, QuizResult } from '@/types/quiz';

/**
 * Calculate quiz score and statistics
 */
export function calculateScore(
    questions: Question[],
    answers: (string | null)[]
): QuizResult {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((question, index) => {
        const userAnswer = answers[index];
        if (userAnswer === null) {
            // Unanswered question counts as incorrect
            incorrectAnswers++;
        } else if (userAnswer === question.correct_answer) {
            correctAnswers++;
        } else {
            incorrectAnswers++;
        }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        timeTaken: 0, // Will be set by caller
    };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Decode HTML entities in text
 */
export function decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get difficulty color for UI
 */
export function getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
        easy: 'text-green-500',
        medium: 'text-yellow-500',
        hard: 'text-red-500',
    };
    return colors[difficulty.toLowerCase()] || 'text-gray-500';
}

/**
 * Get score color based on percentage
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
}

/**
 * Get congratulatory message based on score
 */
export function getScoreMessage(score: number): string {
    if (score === 100) return '🎉 Perfect Score! Outstanding!';
    if (score >= 90) return '🌟 Excellent work!';
    if (score >= 80) return '👏 Great job!';
    if (score >= 70) return '👍 Good effort!';
    if (score >= 60) return '💪 Not bad!';
    if (score >= 50) return '📚 Keep practicing!';
    return '🎯 Try again!';
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Check if answer is correct
 */
export function isAnswerCorrect(question: Question, answer: string | null): boolean {
    return answer === question.correct_answer;
}
