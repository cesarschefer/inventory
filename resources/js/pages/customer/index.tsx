import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { Building2, PenSquare, Plus, RefreshCw, Search, Trash, User, X } from 'lucide-react';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { index as customersIndex } from '@/routes/customers';
import { Column, PaginatedTable } from '@/components/shared/paginated-table';
import { FormDialog } from '@/components/shared/form-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
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
import LabeledSelect from '@/components/ui/labeled-select';
import states from '../../../utils/states.json';
import cities from '../../../utils/cities.json';

type CustomersPageProps = {
    customers: PaginatedResponse<Customer>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string; customer_type: string };
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
        defaultFilters: { search: '', status: '3', customer_type: '3' },
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
                        <div className="flex gap-3">
                            <Input
                                placeholder="Search by name..."
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

                            <Select
                                value={filters.customer_type}
                                onValueChange={(value) => {
                                    updateFilter('customer_type', value);
                                    navigate(1, { customer_type: value });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Customer</SelectItem>
                                    <SelectItem value="2">Company</SelectItem>
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
                    maxWidth="sm:max-w-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-4">
                        <div className="space-y-4">
                            <LabeledSelect
                                label="Customer Type"
                                name="customer_type"
                                value={data.customer_type}
                                disabled={!!editingCustomer}
                                onChange={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        customer_type: value,
                                        tax_id: value === '2' ? prev.tax_id : '',
                                    }));
                                }}
                                options={[
                                    { value: '1', label: 'Customer' },
                                    { value: '2', label: 'Company' },
                                ]}
                                error={errors.customer_type}
                            />
                            {data.customer_type === '2' && (
                                <LabeledInput
                                    label="Tax ID"
                                    name="tax_id"
                                    value={data.tax_id}
                                    onChange={(value) => setData('tax_id', value)}
                                    error={errors.tax_id}
                                />
                            )}
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
                        </div>

                        <div className="space-y-4">
                            <LabeledSelect
                                label="State"
                                name="state"
                                value={data.state}
                                onChange={(value) => {
                                    setData((prev) => ({
                                        ...prev,
                                        state: value,
                                        city: '',
                                    }));
                                }}
                                options={states.map((s) => ({
                                    value: s.code,
                                    label: s.name,
                                }))}
                                error={errors.state}
                            />
                            <LabeledSelect
                                label="City"
                                name="city"
                                value={data.city}
                                onChange={(value) => setData('city', value)}
                                options={filteredCities.map((c) => ({
                                    value: c.name,
                                    label: c.name,
                                }))}
                                error={errors.city}
                                disabled={!data.state}
                                placeholder={!data.state ? "Select state" : "Select city"}
                            />

                            <LabeledInput
                                label="Address"
                                name="address"
                                value={data.address}
                                onChange={(value) => setData('address', value)}
                                error={errors.address}
                            />

                            <div className="grid grid-cols-2 gap-4">
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
                            </div>
                        </div>
                    </div>
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