import { Link } from '@inertiajs/react';

const bgClasses: Record<string, string> = {
    emerald: "bg-emerald-500 hover:bg-emerald-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    amber: "bg-amber-500 hover:bg-amber-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    teal: "bg-teal-500 hover:bg-teal-600",
    rose: "bg-rose-500 hover:bg-rose-600"
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
    const style = bgClasses[bg] || bgClasses.emerald;

    return (
        <Link
            href={href}
            key={cardKey}
            className={`group relative flex flex-col gap-3 rounded-xl border border-border/50 p-6 shadow-sm transition-all hover:border-border hover:shadow-md dark:border-sidebar-border/70 text-white ${style}`}
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
