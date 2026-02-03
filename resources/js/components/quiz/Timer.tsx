import React, { useEffect, useState } from 'react';
import { formatTime } from '@/lib/quizHelpers';
import { Clock } from 'lucide-react';

interface TimerProps {
    timeRemaining: number;
    className?: string;
}

export function Timer({ timeRemaining, className = '' }: TimerProps) {
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        setIsWarning(timeRemaining <= 60 && timeRemaining > 0);
    }, [timeRemaining]);

    const formattedTime = formatTime(timeRemaining);

    return (
        <div
            className={`flex items-center gap-2 rounded-lg border-2 bg-white px-4 py-2 ${isWarning ? 'animate-pulse border-[#F3F827]' : 'border-[#E5E5E0]'
                } ${className}`}
        >
            <Clock
                className={`h-5 w-5 ${isWarning ? 'text-[#F3F827]' : 'text-[#0F1511]'
                    }`}
            />
            <span
                className={`font-mono text-lg font-bold ${isWarning ? 'text-[#F3F827]' : 'text-[#0F1511]'
                    }`}
            >
                {formattedTime}
            </span>
        </div>
    );
}
