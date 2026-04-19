import { Head } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Trash } from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { index as categoriesIndex } from '@/routes/categories';
import { Column, PaginatedTable } from '@/components/shared/paginated-table';
import { FormDialog } from '@/components/shared/form-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageFilters } from '@/components/shared/page-filters';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/category/category-filters';
import { CategoryInputs } from '@/components/category/category-inputs';

import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useFilters } from '@/hooks/use-filters';
import { PaginatedResponse } from '@/types/paginated-response';
import { Category } from '@/types/category';

type CategoriesPageProps = {
    categories: PaginatedResponse<Category>;
    counts: { active: number; inactive: number };
    filters: { search: string; status: string };
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
        defaultFilters: { search: '', status: '3' },
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