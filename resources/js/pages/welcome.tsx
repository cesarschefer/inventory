import { Head, Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';

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
                    <AppLogo
                        className="gap-3"
                        iconClassName="size-10"
                        textClassName="text-xl"
                        hideTextOnMobile={true}
                    />

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
                                        className="rounded-md bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 flex min-h-[calc(60vh)] flex-col items-center justify-center px-6 text-center lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
                            Inventory Management
                            <span className="block text-green-500">
                                Simplified
                            </span>
                        </h1>

                        <p className="mb-10 text-lg text-gray-300 lg:text-xl">
                            Control your stock, products and suppliers
                            efficiently. Optimize your business with tools
                            designed to grow.
                        </p>
                    </div>
                </main>

                <section className="relative z-10 w-full px-6 py-12 lg:absolute lg:right-0 lg:bottom-0 lg:left-0 lg:py-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/15">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                                    <svg className="size-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="mb-1 text-base font-semibold text-white">Manage Invoices</h3>
                                <p className="text-sm text-gray-400">Track, create, and manage all your invoices in one place.</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/15">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                                    <svg className="size-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="mb-1 text-base font-semibold text-white">Generate Reports</h3>
                                <p className="text-sm text-gray-400">Export data in PDF or Excel for better decisions.</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/15">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                                    <svg className="size-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <h3 className="mb-1 text-base font-semibold text-white">Import Tool</h3>
                                <p className="text-sm text-gray-400">Import customers, suppliers, products, and categories from CSV.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
