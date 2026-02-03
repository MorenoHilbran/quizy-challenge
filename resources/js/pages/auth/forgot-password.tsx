// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot password?"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 rounded-lg border-2 border-[#17EC92] bg-[#17EC92]/10 p-3 text-center text-sm font-medium text-[#0F1511]">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#0F1511]">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="border-2 border-[#E5E5E0] bg-white text-[#0F1511] placeholder:text-[#AEB0B8] focus:border-[#E7FE55] focus:ring-0"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="w-full bg-[#E7FE55] text-[#0F1511] hover:bg-[#d4eb3f] font-semibold"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Email password reset link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-[#AEB0B8]">
                    Remember your password?{' '}
                    <TextLink
                        href={login()}
                        className="font-semibold text-[#0F1511] hover:text-[#AEB0B8]"
                    >
                        Log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
