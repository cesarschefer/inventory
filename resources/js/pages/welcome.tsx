import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Inventory Management System" />

            <div className="relative min-h-screen">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/images/background.jpg)' }}
                />
                <div className="absolute inset-0 bg-black/60" />

                <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                    <div className="flex items-center gap-3">
                        <AppLogoIcon className="size-10 text-white" />
                        <span className="text-xl font-semibold text-white">
                            Inventory
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md bg-white px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-medium text-white/90 hover:text-white"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
                            Inventory Management
                            <span className="block text-blue-400">
                                Simplified
                            </span>
                        </h1>

                        <p className="mb-10 text-lg text-gray-300 lg:text-xl">
                            Control your stock, products and suppliers
                            efficiently. Optimize your business with tools
                            designed to grow.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-md border border-white/30 bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm hover:bg-white/20"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
                                        >
                                            Create Account
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>

                <div className="relative z-10 flex justify-center gap-8 px-6 py-8 lg:absolute lg:right-0 lg:bottom-0 lg:left-0">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                            500+
                        </div>
                        <div className="text-sm text-gray-400">Products</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">50+</div>
                        <div className="text-sm text-gray-400">Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">99%</div>
                        <div className="text-sm text-gray-400">Uptime</div>
                    </div>
                </div>
            </div>
        </>
    );
}
