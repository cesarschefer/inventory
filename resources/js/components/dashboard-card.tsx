import { Link } from "@inertiajs/react";

const bgColors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

interface DashboardCardProps {
    title: string;
    cardKey: string;
    href: string;
    bg: string;
    icon: string;
    total: number;
}

export default function DashboardCard({
    title,
    cardKey,
    href,
    bg,
    icon,
    total,
}: DashboardCardProps) {
    const colorClass = bgColors[bg] || 'bg-gray-500/10 text-gray-600';

    return (
        <Link
            href={href}
            key={cardKey}
            className="group relative flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-border hover:shadow-md dark:border-sidebar-border/70"
        >
            <div className="flex items-center justify-between">
                <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}
                >
                    <span className="text-2xl">{icon}</span>
                </span>
                <span className="text-3xl font-semibold tracking-tight">
                    {total}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                    {title}
                </span>
                <span className="text-xs text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
                    View all {title.toLowerCase()}
                </span>
            </div>
        </Link>
    );
}