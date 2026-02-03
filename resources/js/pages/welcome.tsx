import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { Brain, PlayCircle, Trophy, Clock, Target } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Quizy" />
            <div className="flex min-h-screen flex-col bg-[#FBFAF3]">
                {/* Header */}
                <header className="border-b-2 border-[#E5E5E0] bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-[#E7FE55] p-2">
                                <Brain className="h-6 w-6 text-[#0F1511]" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#0F1511]">Quizy</h1>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/quiz/dashboard"
                                    className="rounded-lg border-2 border-[#E5E5E0] bg-white px-6 py-2 font-semibold text-[#0F1511] transition-all hover:border-[#E7FE55] hover:bg-[#FBFAF3]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-lg px-6 py-2 font-semibold text-[#0F1511] transition-all hover:bg-[#FBFAF3]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="rounded-lg bg-[#E7FE55] px-6 py-2 font-semibold text-[#0F1511] transition-all hover:bg-[#d4eb3f]"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 items-center justify-center px-6 py-20">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-[#E7FE55] p-6">
                            <Brain className="h-20 w-20 text-[#0F1511]" />
                        </div>

                        <h2 className="mb-4 text-6xl font-bold text-[#0F1511]">
                            Test Your Knowledge
                        </h2>
                        <p className="mb-12 text-2xl text-[#AEB0B8]">
                            Challenge yourself with quizzes from various categories and track your progress
                        </p>

                        {/* CTA Button */}
                        {auth.user ? (
                            <Link
                                href="/quiz/dashboard"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#E7FE55] px-8 py-4 text-lg font-bold text-[#0F1511] transition-all hover:bg-[#d4eb3f]"
                            >
                                <PlayCircle className="h-6 w-6" />
                                Start Quiz
                            </Link>
                        ) : (
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#E7FE55] px-8 py-4 text-lg font-bold text-[#0F1511] transition-all hover:bg-[#d4eb3f]"
                            >
                                <PlayCircle className="h-6 w-6" />
                                Get Started
                            </Link>
                        )}

                        {/* Features */}
                        <div className="mt-20 grid gap-6 md:grid-cols-3">
                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="mb-4 inline-flex rounded-lg bg-[#FBFAF3] p-3">
                                    <Trophy className="h-8 w-8 text-[#0F1511]" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-[#0F1511]">
                                    Multiple Categories
                                </h3>
                                <p className="text-[#AEB0B8]">
                                    Choose from a wide range of quiz categories to test your knowledge
                                </p>
                            </div>

                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="mb-4 inline-flex rounded-lg bg-[#FBFAF3] p-3">
                                    <Clock className="h-8 w-8 text-[#0F1511]" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-[#0F1511]">
                                    Timed Challenges
                                </h3>
                                <p className="text-[#AEB0B8]">
                                    Race against the clock with our 5-minute quiz timer
                                </p>
                            </div>

                            <div className="rounded-xl border-2 border-[#E5E5E0] bg-white p-6">
                                <div className="mb-4 inline-flex rounded-lg bg-[#FBFAF3] p-3">
                                    <Target className="h-8 w-8 text-[#0F1511]" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-[#0F1511]">
                                    Track Progress
                                </h3>
                                <p className="text-[#AEB0B8]">
                                    Monitor your performance and see your improvement over time
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t-2 border-[#E5E5E0] bg-white py-6">
                    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[#AEB0B8]">
                        © 2026 Quizy. Built by Moreno Hilbran.
                    </div>
                </footer>
            </div>
        </>
    );
}
