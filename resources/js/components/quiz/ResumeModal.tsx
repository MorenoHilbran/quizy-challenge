import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface ResumeModalProps {
    isOpen: boolean;
    onResume: () => void;
    onStartNew: () => void;
    answeredQuestions: number;
    totalQuestions: number;
}

export function ResumeModal({
    isOpen,
    onResume,
    onStartNew,
    answeredQuestions,
    totalQuestions,
}: ResumeModalProps) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="border-2 border-[#E5E5E0] bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl text-[#0F1511]">
                        Resume Quiz?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#AEB0B8]">
                        You have an incomplete quiz with {answeredQuestions} of {totalQuestions} questions answered.
                        Would you like to continue where you left off?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 rounded-lg border-2 border-[#E5E5E0] bg-[#FBFAF3] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[#AEB0B8]">Progress</span>
                        <span className="font-bold text-[#0F1511]">
                            {answeredQuestions}/{totalQuestions}
                        </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E0]">
                        <div
                            className="h-full rounded-full bg-[#E7FE55] transition-all"
                            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
                <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                    <AlertDialogCancel
                        onClick={onStartNew}
                        className="border-2 border-[#E5E5E0] text-[#0F1511] hover:bg-[#FBFAF3]"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Start New Quiz
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onResume}
                        className="bg-[#E7FE55] text-[#0F1511] hover:bg-[#d4eb3f]"
                    >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue Quiz
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
