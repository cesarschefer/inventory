import { Head } from '@inertiajs/react';
import DashboardCard from '@/components/dashboard/dashboard-card';
import dashboardCards from '@/data/dashboard_cards.json';
import { usePermission } from '@/hooks/use-permission';
import { dashboard } from '@/routes';
import type { PermissionName } from '@/types/permission';

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
    const { can } = usePermission();
    const totals = {
        customers,
        suppliers,
        products,
        users,
        categories,
        purchase_invoices,
        sale_invoices,
    };

    const visibleCards = dashboardCards.filter(
        (card) => !card.permission || can(card.permission as PermissionName)
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {visibleCards.map((card) => (
                        <DashboardCard
                            key={card.key}
                            title={card.title}
                            cardKey={card.key}
                            href={card.href}
                            bg={card.bg}
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
