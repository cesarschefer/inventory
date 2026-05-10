import { Head } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Trash } from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { CategoryFilters } from '@/components/category/category-filters';
import { CategoryInputs } from '@/components/category/category-inputs';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { FormDialog } from '@/components/shared/form-dialog';
import { Gate } from '@/components/shared/gate';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { PaginatedTable } from '@/components/shared/paginated-table';
import type { Column} from '@/components/shared/paginated-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useFilters } from '@/hooks/use-filters';
import { usePermission } from '@/hooks/use-permission';
import { useResourceCrud } from '@/hooks/use-resource-crud';
import { index as categoriesIndex } from '@/routes/categories';
import type { Category } from '@/types/category';
import type { PaginatedResponse } from '@/types/paginated-response';

type CategoriesPageProps = {
    categories: PaginatedResponse<Category>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string, page: number };
};

export default function CategoriesIndex({
    categories,
    counts,
    filters: initialFilters,
}: CategoriesPageProps) {

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
        defaultFilters: { search: '', status: '3', page: 1 },
        buildUrl: (params) => categoriesIndex({ query: params }).url,
    });

    const {
        isModalOpen,
        setIsModalOpen,
        editingItem: editingCategory,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        itemToDelete: categoryToDelete,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        confirmDelete,
        handleDelete,
        handleRestore,
        form: { data, setData, processing, errors },
    } = useResourceCrud<Category, { name: string }>({
        storeUrl: CategoryController.store().url,
        updateUrl: (id) => CategoryController.update(id).url,
        destroyUrl: (id) => CategoryController.destroy(id).url,
        restoreUrl: (id) => CategoryController.restore(id).url,
        formFields: { name: '' },
        getEditValues: (cat) => ({ name: cat.name }),
        messages: {
            created: 'Category created successfully',
            updated: 'Category updated successfully',
            deleted: 'Category deleted successfully',
            restored: 'Category restored successfully',
        },
    });

    const { can } = usePermission();

    const columns: Column<Category>[] = [
        {
            header: 'Name',
            primary: true,
            cell: (cat) => cat.name,
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
                <Gate permission="edit-categories">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(cat)}>
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
                    <Gate permission="edit-categories">
                        <Button size="sm" className='cursor-pointer' onClick={() => handleRestore(cat.id)}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </Gate>
                ) : (
                    <Gate permission="delete-categories">
                        <Button size="sm" className='cursor-pointer' variant="destructive" onClick={() => confirmDelete(cat)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </Gate>
                ),
        },
    ];

    return (
        <>
            <Head title="Categories" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage your Product Categories"
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
                        label: 'New Category',
                        onClick: openCreateModal,
                        icon: <Plus className="h-4 w-4" />,
                        disabled: !can('create-categories'),
                    }}
                    filters={
                        <CategoryFilters
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
                    data={categories}
                    columns={columns}
                    entityLabel="categories"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onPageChange={handlePageChange}
                />
            </div>

            <FormDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={
                    editingCategory ? 'Edit Category' : 'Create Category'
                }
                onSubmit={handleSubmit}
                submitLabel="Save"
                submitLoading={processing}
                onCancel={closeModal}
            >
                <CategoryInputs data={data} setData={setData} errors={errors} />
            </FormDialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Category"
                description={`Delete "${categoryToDelete?.name}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: categoriesIndex(),
        },
    ],
};