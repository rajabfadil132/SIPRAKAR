import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 rounded-lg border border-[#4cceac]/30 bg-[#4cceac]/10 px-4 py-3 text-sm font-semibold text-[#4cceac]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#e0e0e0]">
                        Email
                    </label>
                    <div className="flex items-center rounded-lg border border-[#29314b] bg-[#141b2d] px-3 text-[#e0e0e0] focus-within:border-[#6870fa] focus-within:ring-2 focus-within:ring-[#6870fa]/20">
                        <Mail size={18} className="mr-2 text-[#858585]" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full border-0 bg-transparent py-3 text-sm text-[#e0e0e0] placeholder:text-[#666666] focus:outline-none focus:ring-0"
                            placeholder="nama@email.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#e0e0e0]">
                        Password
                    </label>
                    <div className="flex items-center rounded-lg border border-[#29314b] bg-[#141b2d] px-3 text-[#e0e0e0] focus-within:border-[#6870fa] focus-within:ring-2 focus-within:ring-[#6870fa]/20">
                        <LockKeyhole size={18} className="mr-2 text-[#858585]" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full border-0 bg-transparent py-3 text-sm text-[#e0e0e0] placeholder:text-[#666666] focus:outline-none focus:ring-0"
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-[#c2c2c2]">
                        <input
                            name="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-[#29314b] bg-[#141b2d] text-[#6870fa] focus:ring-[#6870fa]"
                        />
                        Remember me
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-bold text-[#4cceac] transition hover:text-[#70d8bd]"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center rounded-lg bg-[#6870fa] px-4 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#6870fa]/20 transition hover:bg-[#535ac8] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={processing}
                >
                    Log in
                    <ArrowRight size={18} className="ml-2 transition group-hover:translate-x-1" />
                </button>
            </form>
        </GuestLayout>
    );
}
