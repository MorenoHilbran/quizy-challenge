import type { Question, QuizSettings, TriviaApiResponse, TriviaCategory } from '@/types/quiz';

const TRIVIA_API_BASE = 'https://opentdb.com';

/**
 * Decode HTML entities in text
 */
function decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Process and decode a single question from the API
 */
function processQuestion(apiQuestion: TriviaApiResponse['results'][0]): Question {
    const allAnswers = shuffleArray([
        apiQuestion.correct_answer,
        ...apiQuestion.incorrect_answers,
    ]);

    return {
        category: decodeHtmlEntities(apiQuestion.category),
        type: apiQuestion.type as 'multiple' | 'boolean',
        difficulty: apiQuestion.difficulty as 'easy' | 'medium' | 'hard',
        question: decodeHtmlEntities(apiQuestion.question),
        correct_answer: decodeHtmlEntities(apiQuestion.correct_answer),
        incorrect_answers: apiQuestion.incorrect_answers.map(decodeHtmlEntities),
        all_answers: allAnswers.map(decodeHtmlEntities),
    };
}

/**
 * Fetch quiz questions from Open Trivia DB
 */
export async function fetchQuestions(settings: QuizSettings): Promise<Question[]> {
    const params = new URLSearchParams({
        amount: settings.amount.toString(),
        ...(settings.category && { category: settings.category }),
        ...(settings.difficulty && { difficulty: settings.difficulty }),
        ...(settings.type && { type: settings.type }),
    });

    try {
        const response = await fetch(`${TRIVIA_API_BASE}/api.php?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch questions from API');
        }

        const data: TriviaApiResponse = await response.json();

        if (data.response_code !== 0) {
            const errorMessages: Record<number, string> = {
                1: 'No questions found for the selected criteria. Please try different settings.',
                2: 'Invalid parameter. Please check your quiz settings.',
                3: 'Session token not found.',
                4: 'Session token has returned all possible questions. Resetting token.',
                5: 'Rate limit exceeded. Please wait a few seconds and try again.',
            };

            throw new Error(errorMessages[data.response_code] || 'Failed to fetch questions');
        }

        return data.results.map(processQuestion);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while fetching questions');
    }
}

/**
 * Fetch available quiz categories
 */
export async function fetchCategories(): Promise<TriviaCategory[]> {
    try {
        const response = await fetch(`${TRIVIA_API_BASE}/api_category.php`);

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        return data.trivia_categories || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Get category name by ID
 */
export function getCategoryName(categories: TriviaCategory[], categoryId: string): string {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : 'Any Category';
}
