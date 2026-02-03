import type { QuizState, Question } from '@/types/quiz';

const STORAGE_KEYS = {
    QUIZ_STATE: 'quizy_active_quiz',
    QUIZ_QUESTIONS: 'quizy_questions',
    QUIZ_ANSWERS: 'quizy_answers',
    QUIZ_TIMER: 'quizy_timer',
    QUIZ_SESSION_ID: 'quizy_session_id',
} as const;

/**
 * Save complete quiz state to localStorage
 */
export function saveQuizState(state: QuizState): void {
    try {
        localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving quiz state:', error);
    }
}

/**
 * Load quiz state from localStorage
 */
export function loadQuizState(): QuizState | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
        if (!stored) return null;

        const state = JSON.parse(stored) as QuizState;

        // Validate that the state has required properties
        if (!state.questions || !Array.isArray(state.questions)) {
            return null;
        }

        return state;
    } catch (error) {
        console.error('Error loading quiz state:', error);
        return null;
    }
}

/**
 * Clear all quiz-related data from localStorage
 */
export function clearQuizState(): void {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('Error clearing quiz state:', error);
    }
}

/**
 * Check if there's an active quiz in localStorage
 */
export function hasActiveQuiz(): boolean {
    try {
        const state = loadQuizState();
        return state !== null && state.isActive && !state.questions.every((_, i) => state.userAnswers[i] !== null);
    } catch (error) {
        return false;
    }
}

/**
 * Save individual quiz answers
 */
export function saveQuizAnswers(answers: (string | null)[]): void {
    try {
        localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(answers));
    } catch (error) {
        console.error('Error saving quiz answers:', error);
    }
}

/**
 * Save timer state
 */
export function saveTimerState(timeRemaining: number): void {
    try {
        localStorage.setItem(STORAGE_KEYS.QUIZ_TIMER, timeRemaining.toString());
    } catch (error) {
        console.error('Error saving timer state:', error);
    }
}

/**
 * Get session ID from localStorage
 */
export function getSessionId(): number | null {
    try {
        const id = localStorage.getItem(STORAGE_KEYS.QUIZ_SESSION_ID);
        return id ? parseInt(id, 10) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Save session ID to localStorage
 */
export function saveSessionId(sessionId: number): void {
    try {
        localStorage.setItem(STORAGE_KEYS.QUIZ_SESSION_ID, sessionId.toString());
    } catch (error) {
        console.error('Error saving session ID:', error);
    }
}
