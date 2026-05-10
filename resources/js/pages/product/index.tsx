import { Head } from '@inertiajs/react';

import { PenSquare, Plus, RefreshCw, Trash } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { ProductFilters } from '@/components/product/product-filters';
import ProductInputs from '@/components/product/product-inputs';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { FormDialog } from '@/components/shared/form-dialog';
import { Gate } from '@/components/shared/gate';
import { PageFilters } from '@/components/shared/page-filters';
import type { Column} from '@/components/shared/paginated-table';
import { index as productsIndex } from '@/routes/products';
import { Category } from '@/types/category';
import { PaginatedTable } from '@/components/shared/paginated-table';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { usePermission } from '@/hooks/use-permission';
import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useFilters } from '@/hooks/use-filters';
import type { PaginatedResponse } from '@/types/paginated-response';
import type { Product } from '@/types/product';


type ProductsPageProps = {
    products: PaginatedResponse<Product>;
    categories: Category[];
    counts: { active: number; inactive: number };
    filters: { search: string; status: string; category_id: string; sku: string; page: number };
};

export default function ProductsIndex({
    products,
    categories,
    counts,
    filters: initialFilters,
}: ProductsPageProps) {
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
        defaultFilters: { search: '', status: '3', category_id: 'all', sku: '', page: 1 },
        buildUrl: (params) => productsIndex({ query: params }).url,
    });

    const {
        isModalOpen,
        setIsModalOpen,
        editingItem: editingProduct,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        itemToDelete: productToDelete,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        confirmDelete,
        handleDelete,
        handleRestore,
        form: { data, setData, processing, errors },
    } = useResourceCrud<Product, {
        category_id: string;
        sku: string;
        name: string;
        detail: string;
        image: string | File | null;
    }>({
        storeUrl: ProductController.store().url,
        updateUrl: (id) => ProductController.update(id).url,
        destroyUrl: (id) => ProductController.destroy(id).url,
        restoreUrl: (id) => ProductController.restore(id).url,
        formFields: {
            name: '',
            category_id: '',
            sku: '',
            detail: '',
            image: null,
        },
        getEditValues: (item) => ({
            name: item.name,
            category_id: item.category.id.toString(),
            sku: item.sku,
            detail: item.detail,
            image: item.image,
        }),
        messages: {
            created: 'Product created successfully',
            updated: 'Product updated successfully',
            deleted: 'Product deleted successfully',
            restored: 'Product restored successfully',
        },
    });

    const columns: Column<Product>[] = [
        {
            header: 'Name',
            primary: true,
            cell: (cat) => cat.name,
        },
        {
            header: 'Category',
            cell: (cat) => cat.category.name,
        },
        {
            header: 'SKU',
            cell: (cat) => cat.sku,
        },
        {
            header: 'Image',
            cell: (cat) => cat.image ? (
                <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted">
                    <img
                        src={`/storage/${cat.image}`}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            ) : (
                <div className="h-12 w-12 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-5 w-5 opacity-40" />
                </div>
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
                <Gate permission="edit-products">
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
                    <Gate permission="edit-products">
                        <Button
                            size="sm"
                            className='cursor-pointer'
                            onClick={() => handleRestore(cat.id)}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </Gate>
                ) : (
                    <Gate permission="delete-products">
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
            <Head title="Products" />

            <div className="mt-3 mb-4 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Manage your Products"
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
                        label: 'New Product',
                        onClick: openCreateModal,
                        icon: <Plus className="h-4 w-4" />,
                        disabled: !can('create-products'),
                    }}
                    filters={
                        <ProductFilters
                            filters={filters}
                            categories={categories}
                            updateFilter={updateFilter}
                            applyFilters={applyFilters}
                            clearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                            navigate={navigate}
                        />
                    }
                />

                <PaginatedTable
                    data={products}
                    columns={columns}
                    entityLabel="products"
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onPageChange={handlePageChange}
                />

                <FormDialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    title={
                        editingProduct ? 'Edit Product' : 'Create Product'
                    }
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                    submitLoading={processing}
                    onCancel={closeModal}
                    maxWidth="sm:max-w-2xl"
                >
                    <ProductInputs
                        data={data}
                        setData={setData}
                        errors={errors}
                        categories={categories}
                    />
                </FormDialog>

                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    title="Delete Product"
                    description={`Delete "${productToDelete?.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirmOpen(false)}
                />
            </div>
        </>
    )
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: productsIndex(),
        },
    ],
};