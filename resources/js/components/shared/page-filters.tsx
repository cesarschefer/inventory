import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type ActionButton = {
    label: string;
    onClick: () => void;
    variant?:
    | 'default'
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'secondary';
    icon?: ReactNode;
    disabled?: boolean;
};

type PageFiltersProps = {
    actionButton?: ActionButton;
    filters?: ReactNode;
};

export function PageFilters({ actionButton, filters }: PageFiltersProps) {
    const hasContent = actionButton || filters;

    if (!hasContent) {
        return null;
    }

    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {actionButton && (
                    <Button
                        onClick={actionButton.onClick}
                        variant={actionButton.variant ?? 'primary'}
                        className="w-fit cursor-pointer gap-2"
                        disabled={actionButton.disabled}
                    >
                        {actionButton.icon}
                        {actionButton.label}
                    </Button>
                )}

                {filters}
            </div>
        </div>
    );
}
