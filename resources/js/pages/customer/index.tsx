import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { Building2, PenSquare, Plus, RefreshCw, Trash, User } from 'lucide-react';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { index as customersIndex } from '@/routes/customers';
import { Column, PaginatedTable } from '@/components/shared/paginated-table';
import { FormDialog } from '@/components/shared/form-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerFilters } from '@/components/customer/customer-filters';

import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useFilters } from '@/hooks/use-filters';
import { PaginatedResponse } from '@/types/paginated-response';
import { Customer } from '@/types/customer';
import states from '../../../utils/states.json';
import cities from '../../../utils/cities.json';
import CustomerInputs from '@/components/customer/customer-inputs';

type CustomersPageProps = {
    customers: PaginatedResponse<Customer>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string; customer_type: string; tax_id: string };
};

export default function CustomersIndex({
    customers,
    counts,
    filters: initialFilters,
}: CustomersPageProps) {
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
        defaultFilters: { search: '', status: '3', customer_type: '3', tax_id: '' },
        buildUrl: (params) => customersIndex({ query: params }).url,
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
    } = useResourceCrud<Customer, {
        name: string;
        email: string;
        tax_id: string;
        phone: string;
        state: string;
        city: string;
        address: string;
        floor: string;
        apartment: string;
        customer_type: string;
    }>({
        storeUrl: CustomerController.store().url,
        updateUrl: (id) => CustomerController.update(id).url,
        destroyUrl: (id) => CustomerController.destroy(id).url,
        restoreUrl: (id) => CustomerController.restore(id).url,
        formFields: {
            name: '',
            email: '',
            tax_id: '',
            phone: '',
            state: '',
            city: '',
            address: '',
            floor: '',
            apartment: '',
            customer_type: '1',
        },
        getEditValues: (item) => ({
            name: item.name,
            email: item.email,
            tax_id: item.tax_id ?? '',
            phone: item.phone ?? '',
            state: item.state ?? '',
            city: item.city ?? '',
            address: item.address ?? '',
            floor: item.floor ?? '',
            apartment: item.apartment ?? '',
            customer_type: item.customer_type.toString(),
        }),
        messages: {
            created: 'Customer created successfully',
            updated: 'Customer updated successfully',
            deleted: 'Customer deleted successfully',
            restored: 'Customer restored successfully',
        },
    });

    const filteredCities = useMemo(() => {
        if (!data.state) return [];
        return cities.filter((c) => c.code === data.state);
    }, [data.state]);

    const columns: Column<Customer>[] = [
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
            header: 'Customer Type',
            cell: (cat) =>
                cat.customer_type === 1 ? (
                    <Badge variant="outline" className="gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        Customer
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        Company
                    </Badge>
                ),
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
                <Button
                    size="sm"
                    className='cursor-pointer'
                    variant="outline"
                    onClick={() => openEditModal(cat)}
                >
                    <PenSquare className="h-4 w-4" />
                </Button>
            ) : null,
        },
        {
            header: 'Actions',
            align: 'center',
            cell: (cat) =>
                cat.deleted_at ? (
                    <Button
                        size="sm"
                        className='cursor-pointer'
                        onClick={() => handleRestore(cat.id)}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        className='cursor-pointer'
                        variant="destructive"
                        onClick={() => confirmDelete(cat)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                ),
        },
    ];


    return (
        <>
            <Head title="Customers" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage your Customers"
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
                        label: 'New Customer',
                        onClick: openCreateModal,
                        icon: <Plus className="h-4 w-4" />,
                    }}
                    filters={
                        <CustomerFilters
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
                    data={customers}
                    columns={columns}
                    entityLabel="customers"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onPageChange={handlePageChange}
                />

                <FormDialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    title={
                        editingCustomer ? 'Edit Customer' : 'Create Customer'
                    }
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                    submitLoading={processing}
                    onCancel={closeModal}
                    maxWidth="sm:max-w-2xl"
                >
                    <FormDialog
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
                        onSubmit={handleSubmit}
                        submitLabel="Save"
                        submitLoading={processing}
                        onCancel={closeModal}
                        maxWidth="sm:max-w-2xl"
                    >
                        <CustomerInputs
                            data={data}
                            setData={setData}
                            errors={errors}
                            states={states}
                            filteredCities={filteredCities}
                            editingCustomer={!!editingCustomer}
                        />
                    </FormDialog>
                </FormDialog>

                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    title="Delete Customer"
                    description={`Delete "${customerToDelete?.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirmOpen(false)}
                />
            </div>
        </>
    )
}

CustomersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: customersIndex(),
        },
    ],
};