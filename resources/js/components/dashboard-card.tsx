import { Link } from '@inertiajs/react';
import {
    BriefcaseIcon,
    Truck,
    Tag,
    ShoppingCart,
    UserIcon,
    FileText,
    DollarSign,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    customers: BriefcaseIcon,
    suppliers: Truck,
    categories: Tag,
    products: ShoppingCart,
    users: UserIcon,
    purchase_invoices: FileText,
    sale_invoices: DollarSign,
};

const bgClasses: Record<string, string> = {
    emerald: 'bg-emerald-500 hover:bg-emerald-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    amber: 'bg-amber-500 hover:bg-amber-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
    teal: 'bg-teal-500 hover:bg-teal-600',
    rose: 'bg-rose-500 hover:bg-rose-600',
};

interface DashboardCardProps {
    title: string;
    cardKey: string;
    href: string;
    bg: string;
    total: number;
}

export default function DashboardCard({
    title,
    cardKey,
    href,
    bg,
    total,
}: DashboardCardProps) {
    const style = bgClasses[bg] || bgClasses.emerald;
    const Icon = iconMap[cardKey] || Users;

    return (
        <Link
            href={href}
            key={cardKey}
            className={`group relative flex flex-col gap-3 rounded-xl border border-border/50 p-6 text-white shadow-sm transition-all hover:border-border hover:shadow-md dark:border-sidebar-border/70 ${style}`}
        >
            <div className="flex items-center justify-between">
                <Icon className="h-8 w-8" />
                <span
                    className={`text-3xl font-semibold tracking-tight text-white`}
                >
                    {total}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs opacity-60 transition-colors group-hover:opacity-100">
                    View all {title.toLowerCase()}
                </span>
            </div>
        </Link>
    );
}
