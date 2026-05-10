import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type { PaginatedResponse } from '@/types/paginated-response';

export type Column<T> = {
    header: string;
    align?: 'left' | 'center' | 'right';
    primary?: boolean; // if true, render the cell with font-medium text-foreground
    cell: (item: T) => ReactNode;
};

type PaginatedTableProps<T extends { id: number }> = {
    data: PaginatedResponse<T>;
    columns: Column<T>[];
    entityLabel?: string;          // ej: 'categories', 'customers'
    emptyMessage?: string;         // ej: 'No categories yet'
    emptyFilterMessage?: string;   // ej: 'No categories match your filters'
    hasActiveFilters?: boolean;    // if true, show the empty filter message, otherwise show the empty message
    onClearFilters?: () => void;   // callback to clear filters
    onPageChange: (page: number) => void; // callback to change page
};

const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
} as const;

export function PaginatedTable<T extends { id: number }>({
    data,
    columns,
    entityLabel = 'items',
    emptyMessage = 'No items yet',
    emptyFilterMessage = 'No items match your filters',
    hasActiveFilters = false,
    onClearFilters,
    onPageChange,
}: PaginatedTableProps<T>) {
    const currentPage = data.current_page;
    const lastPage = data.last_page;

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-5 py-3.5 text-xs font-medium tracking-wider text-muted-foreground uppercase ${alignClass[col.align ?? 'left']}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                            <Search className="h-7 w-7 text-muted-foreground/50" />
                                        </div>
                                        <p className="font-medium text-foreground">
                                            {hasActiveFilters
                                                ? emptyFilterMessage
                                                : emptyMessage}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {hasActiveFilters
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Create the first one to get started'}
                                        </p>
                                        {hasActiveFilters && onClearFilters && (
                                            <Button
                                                variant="primary"
                                                className='cursor-pointer'
                                                size="sm"
                                                onClick={onClearFilters}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {columns.map((col, i) => (
                                        <td
                                            key={i}
                                            className={`px-5 py-4 ${alignClass[col.align ?? 'left']} ${col.primary ? 'font-medium text-foreground' : ''}`}
                                        >
                                            {col.cell(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data.data.length > 0 && (
                <div className="border-t border-border bg-muted/30 px-5 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                            Showing {data.from} to {data.to} of {data.total}{' '}
                            {entityLabel}
                        </p>
                        {lastPage > 1 && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={!data.prev_page_url}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="px-2 text-xs text-muted-foreground">
                                    Page {currentPage} of {lastPage}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={!data.next_page_url}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
