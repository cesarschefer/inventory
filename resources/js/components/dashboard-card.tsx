import { Link } from '@inertiajs/react';

const bgStyles: Record<string, { bg: string }> =
{
    emerald: {
        bg: 'bg-emerald-500',
    },
    orange: {
        bg: 'bg-orange-500',
    },
    amber: {
        bg: 'bg-amber-500',
    },
    purple: {
        bg: 'bg-purple-500',
    },
    indigo: {
        bg: 'bg-indigo-500',
    },
    teal: {
        bg: 'bg-teal-500',
    },
    rose: {
        bg: 'bg-rose-500',
    },
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
    const style = bgStyles[bg] || bgStyles.emerald;

    return (
        <Link
            href={href}
            key={cardKey}
            className={`group relative flex flex-col gap-3 rounded-xl border border-border/50 p-6 shadow-sm transition-all hover:border-border hover:shadow-md dark:border-sidebar-border/70 text-white ${style.bg}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-3xl">{icon}</span>
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
