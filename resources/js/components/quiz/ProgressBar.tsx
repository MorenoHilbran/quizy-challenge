import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className={`w-full ${className}`}>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-[#0F1511]">
                    Question {current} of {total}
                </span>
                <span className="text-[#AEB0B8]">{percentage}% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E5E0]">
                <div
                    className="h-full rounded-full bg-[#E7FE55] transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
