import { ReactNode } from 'react';

type BadgeVariant = 'active' | 'inactive' | 'warning' | 'info';

type PageHeaderBadge = {
    label: string;
    count?: number;
    variant?: BadgeVariant;
};

type PageHeaderProps = {
    description?: string;
    badges?: PageHeaderBadge[];
    children?: ReactNode;
};

const badgeStyles: Record<BadgeVariant, { wrapper: string; dot: string; text: string }> = {
    active: {
        wrapper: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700 dark:text-emerald-400',
    },
    inactive: {
        wrapper: 'border-border bg-muted',
        dot: 'bg-muted-foreground',
        text: 'text-muted-foreground',
    },
    warning: {
        wrapper: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
        dot: 'bg-amber-500',
        text: 'text-amber-700 dark:text-amber-400',
    },
    info: {
        wrapper: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
        dot: 'bg-blue-500',
        text: 'text-blue-700 dark:text-blue-400',
    },
};

export function PageHeader({ description, badges, children }: PageHeaderProps) {
    const rightSection = badges?.length || children;

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}

                {rightSection && (
                    <div className="flex items-center gap-3">
                        {badges?.map((badge, i) => {
                            const style = badgeStyles[badge.variant ?? 'inactive'];
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${style.wrapper}`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                                    <span className={`text-sm font-semibold ${style.text}`}>
                                        {badge.count !== undefined && `${badge.count} `}
                                        {badge.label}
                                    </span>
                                </div>
                            );
                        })}

                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}