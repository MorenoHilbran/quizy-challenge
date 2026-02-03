export interface Question {
    category: string;
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    all_answers: string[]; // Shuffled answers
}

export interface QuizSettings {
    amount: number;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: 'multiple' | 'boolean';
}

export interface QuizState {
    sessionId: number | null;
    questions: Question[];
    currentQuestionIndex: number;
    userAnswers: (string | null)[];
    timeRemaining: number; // in seconds
    isActive: boolean;
    settings: QuizSettings;
    startedAt: string | null;
}

export interface QuizResult {
    id?: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTaken: number; // in seconds
    category?: string;
    difficulty?: string;
    createdAt?: string;
}

export interface QuizSession {
    id: number;
    user_id: number;
    quiz_data: {
        questions: Question[];
        answers: (string | null)[];
        settings: QuizSettings;
    };
    total_questions: number;
    answered_questions: number;
    score: number | null;
    completed: boolean;
    started_at: string;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface TriviaCategory {
    id: number;
    name: string;
}

export interface TriviaApiResponse {
    response_code: number;
    results: Array<{
        category: string;
        type: string;
        difficulty: string;
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
    }>;
}
