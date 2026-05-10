import { Head } from '@inertiajs/react';

import { ReportsFilters } from '@/components/report/report-filters';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { useFilters } from '@/hooks/use-filters';
import { index as reportsIndex } from '@/routes/reports';

type ReportsPageProps = {
    filters: { report_type: string; date_from: string; date_to: string; };
};

export default function ReportsIndex({
    filters: initialFilters,
}: ReportsPageProps) {
    const {
        filters,
        updateFilter,
    } = useFilters({
        initialFilters,
        defaultFilters: { report_type: 'purchases', date_from: '', date_to: '' },
        buildUrl: (params) => reportsIndex({ query: params }).url,
    });

    return (
        <>
            <Head title="Reports" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Download your reports in CSV or PDF format."
                />

                <PageFilters
                    filters={
                        <ReportsFilters
                            filters={filters}
                            updateFilter={updateFilter}
                        />
                    }
                />
            </div>
        </>
    )
}

ReportsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: reportsIndex(),
        },
    ],
};
