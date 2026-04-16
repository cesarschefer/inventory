import { ReactNode } from 'react';

type PageFiltersProps = {
    children?: ReactNode;
};

export function PageFilters({ children }: PageFiltersProps) {
    if (!children) {
        return null;
    }

    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {children}
            </div>
        </div>
    );
}
