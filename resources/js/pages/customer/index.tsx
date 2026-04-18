import { Head } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Search, Trash, X } from 'lucide-react';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { index as customersIndex } from '@/routes/customers';
import { Column, PaginatedTable } from '@/components/shared/paginated-table';
import { FormDialog } from '@/components/shared/form-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useFilters } from '@/hooks/use-filters';
import { PaginatedResponse } from '@/types/paginated-response';
import { Customer } from '@/types/customer';
import LabeledInput from '@/components/ui/labeled-input';


type CustomersPageProps = {
    customers: PaginatedResponse<Customer>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string };
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
        defaultFilters: { search: '', status: '3' },
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
            customer_type: '',
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
            cell: (cat) => cat.customer_type,
        },
        {
            header: 'Status',
            align: 'center',
            cell: (cat) =>
                cat.deleted_at ? 'Inactive' : 'Active',
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
                        <div className="flex gap-3">
                            <Input
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) =>
                                    updateFilter('search', e.target.value)
                                }
                                onBlur={applyFilters}
                            />
                            <Select
                                value={filters.status}
                                onValueChange={(value) => {
                                    updateFilter('status', value);
                                    navigate(1, { status: value });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="2">Inactive</SelectItem>
                                    <SelectItem value="3">All</SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button
                                    variant="primary"
                                    className='cursor-pointer'
                                    onClick={clearFilters}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
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
                >
                    <Select
                        value={data.customer_type}
                        onValueChange={(value) => {
                            setData('customer_type', value);
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Customer</SelectItem>
                            <SelectItem value="2">Company</SelectItem>
                        </SelectContent>
                    </Select>
                    <LabeledInput
                        label="Name"
                        name="name"
                        value={data.name}
                        onChange={(value) => setData('name', value)}
                        error={errors.name}
                    />
                    <LabeledInput
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => setData('email', value)}
                        error={errors.email}
                    />
                    <LabeledInput
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(value) => setData('phone', value)}
                        error={errors.phone}
                    />
                    <LabeledInput
                        label="Address"
                        name="address"
                        value={data.address}
                        onChange={(value) => setData('address', value)}
                        error={errors.address}
                    />
                    <LabeledInput
                        label="Floor"
                        name="floor"
                        value={data.floor}
                        onChange={(value) => setData('floor', value)}
                        error={errors.floor}
                    />
                    <LabeledInput
                        label="Apartment"
                        name="apartment"
                        value={data.apartment}
                        onChange={(value) => setData('apartment', value)}
                        error={errors.apartment}
                    />

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