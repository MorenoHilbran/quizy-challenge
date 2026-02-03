import React from 'react';
import type { Question } from '@/types/quiz';
import { CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer: string | null;
    onAnswerSelect: (answer: string) => void;
    className?: string;
}

const difficultyColors = {
    easy: 'bg-[#17EC92]/10 text-[#17EC92] border-[#17EC92]',
    medium: 'bg-[#F3F827]/10 text-[#0F1511] border-[#F3F827]',
    hard: 'bg-[#DE0F4D]/10 text-[#DE0F4D] border-[#DE0F4D]',
};

export function QuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    onAnswerSelect,
    className = '',
}: QuestionCardProps) {
    return (
        <div
            className={`w-full max-w-4xl rounded-2xl border-2 border-[#E5E5E0] bg-white p-8 ${className}`}
        >
            {/* Question Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="rounded-full border-2 border-[#E5E5E0] bg-[#FBFAF3] px-4 py-1 text-sm font-semibold text-[#0F1511]">
                        {question.category}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyColors[question.difficulty]}`}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </span>
                </div>
                <span className="text-sm text-[#AEB0B8]">
                    {question.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
                </span>
            </div>

            {/* Question Text */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold leading-relaxed text-[#0F1511]">
                    {question.question}
                </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
                {question.all_answers.map((answer, index) => {
                    const isSelected = selectedAnswer === answer;
                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                        <button
                            key={index}
                            onClick={() => onAnswerSelect(answer)}
                            className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${isSelected
                                    ? 'border-[#E7FE55] bg-[#E7FE55]/10 shadow-md'
                                    : 'border-[#E5E5E0] bg-white hover:border-[#E7FE55] hover:bg-[#FBFAF3]'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Letter Badge */}
                                <div
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold transition-colors ${isSelected
                                            ? 'bg-[#E7FE55] text-[#0F1511]'
                                            : 'bg-[#FBFAF3] text-[#AEB0B8] group-hover:bg-[#E7FE55] group-hover:text-[#0F1511]'
                                        }`}
                                >
                                    {letters[index]}
                                </div>

                                {/* Answer Text */}
                                <span className="flex-1 text-lg text-[#0F1511]">{answer}</span>

                                {/* Selected Indicator */}
                                {isSelected && (
                                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[#E7FE55]" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
