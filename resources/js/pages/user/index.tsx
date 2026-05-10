import { Head } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import UserRoleController from '@/actions/App/Http/Controllers/UserRoleController';
import { FormDialog } from '@/components/shared/form-dialog';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import type { Column } from '@/components/shared/paginated-table';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { Button } from '@/components/ui/button';
import { UserFilters } from '@/components/user/user-filters';
import { UserRoleInputs } from '@/components/user/user-role-inputs';
import { useFilters } from '@/hooks/use-filters';
import { index as usersIndex } from '@/routes/users';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { Role } from '@/types/role';
import type { User } from '@/types/user';
import { useFormDialog } from '@/hooks/use-form-dialog';

type UsersPageProps = {
    users: PaginatedResponse<User>;
    filters: { name: string; email: string; page: number };
    availableRoles: Role[];
};

export default function UsersIndex({
    users,
    filters: initialFilters,
    availableRoles,
}: UsersPageProps) {
    const {
        filters,
        updateFilter,
        applyFilters,
        clearFilters,
        handlePageChange,
        hasActiveFilters,
    } = useFilters({
        initialFilters,
        defaultFilters: { name: '', email: '', page: 1 },
        buildUrl: (params) => usersIndex({ query: params }).url,
    });

    const {
        isOpen,
        setIsOpen,
        editingItem: editingUser,
        openEdit: openRoleModal,
        close: closeRoleModal,
        handleSubmit,
        form: { data, setData, processing, errors },
    } = useFormDialog<User, { roles: number[] }>({
        storeUrl: '',
        updateUrl: (id) => UserRoleController.put(id).url,
        formFields: { roles: [] },
        getEditValues: (user) => ({
            roles: user.roles.map((role) => role.id),
        }),
        messages: {
            updated: 'User roles updated successfully',
        },
    });

    const columns: Column<User>[] = [
        {
            header: 'Name',
            cell: (user) => user.name,
        },
        {
            header: 'Email',
            cell: (user) => user.email,
        },
        {
            header: 'Roles',
            cell: (user) => user.roles.map(role => role.name).join(', ') || '-',
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (user) => (
                <Button
                    variant="primary"
                    size="sm"
                    className="h-8 px-2 cursor-pointer text-white"
                    onClick={() => openRoleModal(user)}
                    title="Assign Roles"
                >
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-xs">Roles</span>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Users" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader description="Manage and track your Users" />

                <PageFilters
                    filters={
                        <UserFilters
                            filters={filters}
                            updateFilter={updateFilter}
                            applyFilters={applyFilters}
                            clearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    }
                />

                <div className="space-y-4">
                    <PaginatedTable
                        data={users}
                        columns={columns}
                        entityLabel="users"
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={clearFilters}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <FormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Assign Roles"
                description={`Manage roles for ${editingUser?.name}`}
                icon={<Shield className="h-5 w-5 text-primary" />}
                onSubmit={handleSubmit}
                submitLabel="Update Roles"
                submitLoading={processing}
                onCancel={closeRoleModal}
                maxWidth="sm:max-w-md"
            >
                <UserRoleInputs
                    data={data}
                    setData={setData}
                    availableRoles={availableRoles}
                    errors={errors}
                />
            </FormDialog>
        </>
    )
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersIndex(),
        },
    ],
};
