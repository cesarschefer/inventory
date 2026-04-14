import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import dashboardCards from '@/data/dashboard_cards.json';
import DashboardCard from '@/components/dashboard-card';

type DashboardProps = {
    customers: number;
    suppliers: number;
    products: number;
    users: number;
    categories: number;
    purchase_invoices: number;
    sale_invoices: number;
};


export default function Dashboard({
    customers,
    suppliers,
    products,
    users,
    categories,
    purchase_invoices,
    sale_invoices,
}: DashboardProps) {

    const totals = {
        customers,
        suppliers,
        products,
        users,
        categories,
        purchase_invoices,
        sale_invoices,
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {dashboardCards.map((card) => (
                        <DashboardCard
                            key={card.key}
                            title={card.title}
                            cardKey={card.key}
                            href={card.href}
                            bg={card.bg}
                            icon={card.icon}
                            total={totals[card.key as keyof typeof totals] ?? 0}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
