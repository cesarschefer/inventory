import { Head } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Trash } from 'lucide-react';
import { useMemo } from 'react';
import SupplierController from '@/actions/App/Http/Controllers/SupplierController';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { FormDialog } from '@/components/shared/form-dialog';
import { Gate } from '@/components/shared/gate';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import type { Column} from '@/components/shared/paginated-table';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { SupplierFilters } from '@/components/supplier/supplier-filters';
import SupplierInputs from '@/components/supplier/supplier-inputs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


import { usePermission } from '@/hooks/use-permission';
import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useFilters } from '@/hooks/use-filters';
import { index as suppliersIndex } from '@/routes/suppliers';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { Supplier } from '@/types/supplier';

import cities from '../../../utils/cities.json';
import states from '../../../utils/states.json';

type SuppliersPageProps = {
    suppliers: PaginatedResponse<Supplier>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string; tax_id: string; page: number };
};

export default function SuppliersIndex({
    suppliers,
    counts,
    filters: initialFilters,
}: SuppliersPageProps) {
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
        defaultFilters: { search: '', status: '3', tax_id: '', page: 1 },
        buildUrl: (params) => suppliersIndex({ query: params }).url,
    });

    const {
        isModalOpen,
        setIsModalOpen,
        editingItem: editingCustomer,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        itemToDelete: customerToDelete,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        confirmDelete,
        handleDelete,
        handleRestore,
        form: { data, setData, processing, errors },
    } = useResourceCrud<Supplier, {
        name: string;
        email: string;
        tax_id: string;
        phone: string;
        state: string;
        city: string;
        address: string;
    }>({
        storeUrl: SupplierController.store().url,
        updateUrl: (id) => SupplierController.update(id).url,
        destroyUrl: (id) => SupplierController.destroy(id).url,
        restoreUrl: (id) => SupplierController.restore(id).url,
        formFields: {
            name: '',
            email: '',
            tax_id: '',
            phone: '',
            state: '',
            city: '',
            address: '',
        },
        getEditValues: (item) => ({
            name: item.name,
            email: item.email,
            tax_id: item.tax_id ?? '',
            phone: item.phone ?? '',
            state: item.state ?? '',
            city: item.city ?? '',
            address: item.address ?? '',
        }),
        messages: {
            created: 'Supplier created successfully',
            updated: 'Supplier updated successfully',
            deleted: 'Supplier deleted successfully',
            restored: 'Supplier restored successfully',
        },
    });

    const filteredCities = useMemo(() => {
        if (!data.state) {
return [];
}

        return cities.filter((c) => c.code === data.state);
    }, [data.state]);

    const columns: Column<Supplier>[] = [
        {
            header: 'Name',
            primary: true,
            cell: (cat) => cat.name,
        },
        {
            header: 'Tax ID',
            cell: (cat) => cat.tax_id,
        },
        {
            header: 'Email',
            cell: (cat) => cat.email,
        },
        {
            header: 'Status',
            align: 'center',
            cell: (cat) =>
                cat.deleted_at ? (
                    <Badge variant="destructive">Inactive</Badge>
                ) : (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">Active</Badge>
                ),
        },
        {
            header: 'Edit',
            align: 'center',
            cell: (cat) => !cat.deleted_at ? (
                <Gate permission="edit-suppliers">
                    <Button
                        size="sm"
                        className='cursor-pointer'
                        variant="outline"
                        onClick={() => openEditModal(cat)}
                    >
                        <PenSquare className="h-4 w-4" />
                    </Button>
                </Gate>
            ) : null,
        },
        {
            header: 'Actions',
            align: 'center',
            cell: (cat) =>
                cat.deleted_at ? (
                    <Gate permission="edit-suppliers">
                        <Button
                            size="sm"
                            className='cursor-pointer'
                            onClick={() => handleRestore(cat.id)}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </Gate>
                ) : (
                    <Gate permission="delete-suppliers">
                        <Button
                            size="sm"
                            className='cursor-pointer'
                            variant="destructive"
                            onClick={() => confirmDelete(cat)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </Gate>
                ),
        },
    ];


    return (
        <>
            <Head title="Suppliers" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage your Suppliers"
                    badges={[
                        {
                            label: 'Active',
                            count: counts.active,
                            variant: 'active',
                        },
                        {
                            label: 'Inactive',
                            count: counts.inactive,
                            variant: 'inactive',
                        },
                    ]}
                />

                <PageFilters
                    actionButton={{
                        label: 'New Supplier',
                        onClick: openCreateModal,
                        icon: <Plus className="h-4 w-4" />,
                        disabled: !can('create-suppliers'),
                    }}
                    filters={
                        <SupplierFilters
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
                    data={suppliers}
                    columns={columns}
                    entityLabel="suppliers"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onPageChange={handlePageChange}
                />

                <FormDialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    title={
                        editingCustomer ? 'Edit Supplier' : 'Create Supplier'
                    }
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                    submitLoading={processing}
                    onCancel={closeModal}
                    maxWidth="sm:max-w-2xl"
                >
                    <SupplierInputs
                        data={data}
                        setData={setData}
                        errors={errors}
                        states={states}
                        filteredCities={filteredCities}
                    />
                </FormDialog>

                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    title="Delete Supplier"
                    description={`Delete "${customerToDelete?.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirmOpen(false)}
                />
            </div>
        </>
    )
}

SuppliersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: suppliersIndex(),
        },
    ],
};