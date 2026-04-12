import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthCenteredLayout({
    children,
    title,
    description,
    backgroundImage,
}: AuthLayoutProps & { backgroundImage: string }) {
    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                <Link href={home()} className="flex items-center gap-3">
                    <AppLogoIcon className="size-10 text-white" />
                    <span className="text-xl font-semibold text-white">
                        Inventory
                    </span>
                </Link>
            </header>

            <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            {title}
                        </h1>
                        <p className="mt-2 text-gray-300">{description}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-gray-900/80 shadow-2xl backdrop-blur-xl">
                        <div className="p-8">{children}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
