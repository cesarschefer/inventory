import { Head, router } from '@inertiajs/react';
import { Eye, Plus, Trash, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PurchaseInvoiceFilters } from '@/components/purchase-invoice/purchase-invoice-filters';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Gate } from '@/components/shared/gate';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import type { Column } from '@/components/shared/paginated-table';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useFilters } from '@/hooks/use-filters';
import { usePermission } from '@/hooks/use-permission';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { PurchaseInvoice } from '@/types/purchase-invoice';
import {
    index as purchaseInvoicesIndex,
    create as createPurchaseInvoice,
    show as showPurchaseInvoice,
    destroy as destroyPurchaseInvoice,
    confirm as confirmPurchaseInvoice
} from '@/routes/purchase-invoices';

type PurchaseInvoicesPageProps = {
    purchaseInvoices: PaginatedResponse<PurchaseInvoice>;
    filters: { number: string; dateFrom: string; dateTo: string; status: string; page: number };
};

export default function PurchaseInvoicesIndex({
    purchaseInvoices,
    filters: initialFilters,
}: PurchaseInvoicesPageProps) {
    const { can } = usePermission();
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
        defaultFilters: { number: '', dateFrom: '', dateTo: '', status: 'all', page: 1 },
        buildUrl: (params) => purchaseInvoicesIndex({ query: params }).url,
    });

    const deleteDialog = useConfirmDialog<PurchaseInvoice>({
        onConfirm: (invoice) => {
            router.delete(destroyPurchaseInvoice(invoice.id).url, {
                onSuccess: () => {
                    deleteDialog.close();
                    toast.success('Purchase Invoice deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'An error occurred while deleting the invoice');
                    deleteDialog.close();
                }
            });
        },
    });

    const handleStatusChange = (invoice: PurchaseInvoice) => {
        router.put(confirmPurchaseInvoice(invoice.id).url, {}, {
            onSuccess: () => {
                toast.success('Purchase Invoice ' + invoice.number + ' confirmed successfully');
            },
            onError: (errors) => {
                toast.error(errors.message || 'An error occurred while confirming the invoice');
            }
        });
    };

    const columns: Column<PurchaseInvoice>[] = [
        {
            header: 'Number',
            primary: true,
            cell: (invoice) => invoice.number,
        },
        {
            header: 'Supplier',
            cell: (invoice) => invoice.supplier.name,
        },
        {
            header: 'Date',
            cell: (invoice) => invoice.formatted_date || invoice.date,
        },
        {
            header: 'Total',
            cell: (invoice) => invoice.total,
        },
        {
            header: 'Status',
            align: 'center',
            cell: (invoice) => {
                const status = Number(invoice.status);

                if (status === 1) {
                    return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">Confirmed</Badge>;
                }

                if (status === 2) {
                    return <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">Cancelled</Badge>;
                }

                return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-800">Created</Badge>;
            },
        },
        {
            header: 'Actions',
            align: 'center',
            cell: (invoice) => {
                const status = Number(invoice.status);

                return (
                    <div className="flex justify-center gap-2">
                        <Gate permission="view-purchases">
                            <Button
                                size="sm"
                                variant="ghost"
                                className='cursor-pointer h-8 w-8 p-0'
                                onClick={() => router.get(showPurchaseInvoice(invoice.id).url)}
                                title="View/Edit"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Gate>

                        {status === 0 && (
                            <>
                                <Gate permission="edit-purchases">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className='cursor-pointer h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                        onClick={() => handleStatusChange(invoice)}
                                        title="Confirm Invoice"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </Gate>

                                <Gate permission="delete-purchases">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className='cursor-pointer h-8 w-8 p-0 text-destructive hover:bg-destructive/10'
                                        onClick={() => deleteDialog.open(invoice)}
                                        title="Cancel Invoice"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </Gate>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Purchase Invoices" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage your Purchase Invoices"
                />

                <PageFilters
                    actionButton={{
                        label: 'New Purchase Invoice',
                        onClick: () => router.get(createPurchaseInvoice().url),
                        icon: <Plus className="h-4 w-4" />,
                        disabled: !can('create-purchases'),
                    }}
                    filters={
                        <PurchaseInvoiceFilters
                            filters={filters}
                            updateFilter={updateFilter}
                            applyFilters={applyFilters}
                            clearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                            navigate={navigate}
                        />
                    }
                />

                <PaginatedTable
                    data={purchaseInvoices}
                    columns={columns}
                    entityLabel="purchase invoices"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onPageChange={handlePageChange}
                />

                <ConfirmDialog
                    open={deleteDialog.isOpen}
                    onOpenChange={deleteDialog.setIsOpen}
                    title="Delete Purchase Invoice"
                    description={`Are you sure you want to delete purchase invoice "${deleteDialog.pendingItem?.number}"? This action cannot be undone.`}
                    onConfirm={deleteDialog.confirm}
                    onCancel={deleteDialog.cancel}
                />
            </div>
        </>
    )
}

PurchaseInvoicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Purchase Invoices',
            href: purchaseInvoicesIndex(),
        },
    ],
};