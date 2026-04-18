import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Filters = Record<string, string | number | undefined>;

type UseFiltersOptions<T extends Filters> = {
    initialFilters: T;
    defaultFilters: T;
    buildUrl: (params: T & { page?: number }) => string;
};

export function useFilters<T extends Filters>({
    initialFilters,
    defaultFilters,
    buildUrl,
}: UseFiltersOptions<T>) {

    const [filters, setFilters] = useState<T>(initialFilters);

    // Sync with Inertia (when props change from the server)
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const navigate = (page?: number, overrides?: Partial<T>) => {
        router.get(
            buildUrl({
                ...filters,
                ...overrides,
                ...(page ? { page } : {}),
            }),
            {},
            { replace: true },
        );
    };

    const applyFilters = () => {
        navigate(1);
    };

    const clearFilters = () => {
        setFilters(defaultFilters);

        router.get(
            buildUrl({
                ...defaultFilters,
                page: 1,
            }),
            {},
            { replace: true },
        );
    };

    const handlePageChange = (page: number) => {
        navigate(page);
    };

    const hasActiveFilters = Object.keys(filters).some((key) => {
        const value = filters[key];
        const defaultValue = defaultFilters[key];

        return value !== defaultValue;
    });

    return {
        filters,
        updateFilter,
        applyFilters,
        clearFilters,
        handlePageChange,
        hasActiveFilters,
        navigate,
    };
}