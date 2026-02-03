import { Link } from '@inertiajs/react';
import { Brain } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#FBFAF3]">
            {/* Left Side - Branding */}
            <div className="hidden w-1/2 flex-col justify-between border-r-2 border-[#E5E5E0] bg-white p-12 lg:flex">
                <Link
                    href={home()}
                    className="flex items-center gap-3"
                >
                    <div className="rounded-lg bg-[#E7FE55] p-2">
                        <Brain className="h-8 w-8 text-[#0F1511]" />
                    </div>
                    <span className="text-2xl font-bold text-[#0F1511]">Quizy</span>
                </Link>

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-[#0F1511]">
                        Test Your Knowledge
                    </h2>
                    <p className="text-lg text-[#AEB0B8]">
                        Challenge yourself with quizzes from various categories and track your progress over time.
                    </p>
                </div>

                <p className="text-sm text-[#AEB0B8]">
                    © 2026 Quizy. Built by Moreno Hilbran.
                </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="mb-8 flex items-center justify-center gap-3 lg:hidden"
                    >
                        <div className="rounded-lg bg-[#E7FE55] p-2">
                            <Brain className="h-6 w-6 text-[#0F1511]" />
                        </div>
                        <span className="text-2xl font-bold text-[#0F1511]">Quizy</span>
                    </Link>

                    {/* Form Header */}
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold text-[#0F1511]">{title}</h1>
                        <p className="text-[#AEB0B8]">{description}</p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
