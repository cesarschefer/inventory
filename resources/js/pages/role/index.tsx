import { Head } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { RolePermissionInputs } from '@/components/role/role-permission-inputs';
import { FormDialog } from '@/components/shared/form-dialog';
import { PageHeader } from '@/components/shared/page-header';
import type { Column} from '@/components/shared/paginated-table';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/hooks/use-filters';
import { useFormDialog } from '@/hooks/use-form-dialog';
import { index as rolesIndex } from '@/routes/roles';
import { update as updateRolePermissions } from '@/routes/roles/permissions';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { Permission } from '@/types/permission';
import type { Role } from '@/types/role';

type RolesPageProps = {
    roles: PaginatedResponse<Role>;
    availablePermissions: Record<string, Permission[]>;
    filters: { page: number };
};

export default function RolesIndex({
    roles,
    availablePermissions,
    filters: initialFilters,
}: RolesPageProps) {

    const { handlePageChange } = useFilters({
        initialFilters,
        defaultFilters: { page: 1 },
        buildUrl: (params) => rolesIndex({ query: params }).url,
    });

    const {
        isOpen,
        setIsOpen,
        editingItem: editingRole,
        openEdit: openPermissionModal,
        close: closePermissionModal,
        handleSubmit,
        form: { data, setData, processing, errors },
    } = useFormDialog<Role, { permissions: number[] }>({
        storeUrl: '',
        updateUrl: (id) => updateRolePermissions(id).url,
        formFields: { permissions: [] },
        getEditValues: (role) => ({
            permissions: role.permissions.map((p) => p.id),
        }),
        messages: {
            updated: 'Role permissions updated successfully',
        },
    });

    const columns: Column<Role>[] = [
        {
            header: 'Name',
            primary: true,
            cell: (role) => role.name,
        },
        {
            header: 'Permissions',
            cell: (role) => {
                if (!role.permissions || role.permissions.length === 0) {
                    return <span className="text-xs text-muted-foreground italic">No permissions</span>;
                }

                return (
                    <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 5).map((p) => (
                            <span key={p.id} className="text-[10px] bg-muted/80 border border-border/50 px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                                {p.name}
                            </span>
                        ))}
                        {role.permissions.length > 5 && (
                            <span className="text-[10px] text-muted-foreground px-1">
                                +{role.permissions.length - 5} more
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (role) => (
                <Button
                    variant="primary"
                    size="sm"
                    className="h-8 px-2 cursor-pointer text-white"
                    onClick={() => openPermissionModal(role)}
                    title="Assign Permissions"
                >
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-xs">Permissions</span>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Roles" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader description="Manage your Roles" />

                <div className="space-y-4">
                    <PaginatedTable
                        data={roles}
                        columns={columns}
                        entityLabel="roles"
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <FormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Assign Permissions"
                description={`Manage permissions for ${editingRole?.name} role`}
                icon={<Shield className="h-5 w-5 text-primary" />}
                onSubmit={handleSubmit}
                submitLabel="Update Permissions"
                submitLoading={processing}
                onCancel={closePermissionModal}
                maxWidth="sm:max-w-2xl"
            >
                <RolePermissionInputs
                    data={data}
                    setData={setData}
                    availablePermissions={availablePermissions}
                    errors={errors}
                />
            </FormDialog>
        </>
    )
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: rolesIndex(),
        },
    ],
};
