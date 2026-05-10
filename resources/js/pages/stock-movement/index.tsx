import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import type { Column} from '@/components/shared/paginated-table';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { StockMovementFilters } from '@/components/stock-movement/stock-movement-filters';
import { useFilters } from '@/hooks/use-filters';
import {
    show as showPurchaseInvoice,
} from '@/routes/purchase-invoices';
import {
    show as showSaleInvoice,
} from '@/routes/sale-invoices';
import {
    index as stockMovementsIndex,
} from '@/routes/stock-movements';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { StockMovement } from '@/types/stock-movement';

type StockMovementsPageProps = {
    stockMovements: PaginatedResponse<StockMovement>;
    products: { id: number; name: string; }[];
    totals: number;
    filters: { productId: string; dateFrom: string; dateTo: string; page: number };
};

export default function StockMovementsIndex({
    stockMovements,
    products,
    totals,
    filters: initialFilters,
}: StockMovementsPageProps) {
    const {
        filters,
        updateFilter,
        applyFilters,
        clearFilters,
        handlePageChange,
        hasActiveFilters,
        navigate,
    } = useFilters({
        initialFilters,
        defaultFilters: { productId: 'all', dateFrom: '', dateTo: '', page: 1 },
        buildUrl: (params) => stockMovementsIndex({ query: params }).url,
    });

    const columns: Column<StockMovement>[] = [
        {
            header: 'Date',
            cell: (movement) => movement.formatted_date || movement.created_at || '-',
        },
        {
            header: 'Product',
            cell: (movement) => movement.product?.name || '-',
        },
        {
            header: 'Quantity',
            cell: (movement) => (
                <span className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                </span>
            ),
        },
        {
            header: 'Type',
            cell: (movement) => (
                <span className="capitalize">{String(movement.type).replace('_', ' ')}</span>
            ),
        },
        {
            header: 'Document',
            cell: (movement) => {
                if (!movement.document) {
return '-';
}

                const href = movement.document_type === 'sale'
                    ? showSaleInvoice({ sale_invoice: Number(movement.document.id) }).url
                    : showPurchaseInvoice({ purchase_invoice: Number(movement.document.id) }).url;

                return (
                    <Link
                        href={href}
                        className="text-primary hover:underline flex items-center gap-1"
                    >
                        <FileText className="h-4 w-4" />
                        View
                    </Link>
                );
            },
        }
    ];

    const selectedProduct = products.find(p => String(p.id) === initialFilters.productId);

    return (
        <>
            <Head title="Stock Movements" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage and track your Stock Movements"
                />

                <PageFilters
                    filters={
                        <StockMovementFilters
                            filters={filters}
                            updateFilter={updateFilter}
                            applyFilters={applyFilters}
                            clearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                            navigate={navigate}
                            products={products}
                        />
                    }
                />

                {initialFilters.productId && initialFilters.productId !== 'all' && selectedProduct && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <h2 className="text-lg font-semibold">Stock Availability Totals</h2>
                        </div>
                        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Product Name</th>
                                        <th className="px-4 py-3 text-right font-medium">Total Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-3">{selectedProduct.name}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${totals >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {totals}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <h2 className="text-lg font-semibold">Movements History</h2>
                    </div>
                    <PaginatedTable
                        data={stockMovements}
                        columns={columns}
                        entityLabel="stock movements"
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={clearFilters}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    )
}

StockMovementsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Stock Movements',
            href: stockMovementsIndex(),
        },
    ],
};
