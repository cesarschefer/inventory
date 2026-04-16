import { Head, router, useForm } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Search, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Category = {
    id: number;
    name: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

type CategoriesPageProps = {
    categories: {
        data: Category[];
    };
};

export default function CategoriesIndex({ categories }: CategoriesPageProps) {
    const [nameFilter, setNameFilter] = useState('');
    const [categoryActiveFilter, setCategoryActiveFilter] = useState<
        '1' | '2' | '3'
    >('1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
        });

    const activeCategories = categories.data.filter((c) => !c.deleted_at);
    const inactiveCategories = categories.data.filter((c) => c.deleted_at);

    const filteredCategories = categories.data.filter((category) => {
        const nameMatch = category.name
            .toLowerCase()
            .includes(nameFilter.toLowerCase());
        const isInactive = category.deleted_at !== null;
        const statusMatch =
            categoryActiveFilter === '1'
                ? !isInactive
                : categoryActiveFilter === '2'
                  ? isInactive
                  : true;

        return nameMatch && statusMatch;
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setData('name', category.name);
        clearErrors();
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(CategoryController.update(editingCategory.id).url, {
                onSuccess: () => {
                    closeModal();
                    toast.success('Category updated successfully');
                },
            });
        } else {
            post(CategoryController.store().url, {
                onSuccess: () => {
                    closeModal();
                    toast.success('Category created successfully');
                },
            });
        }
    };

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (!categoryToDelete) {
            return;
        }

        router.delete(CategoryController.destroy(categoryToDelete.id).url, {
            onSuccess: () => {
                setDeleteConfirmOpen(false);
                setCategoryToDelete(null);
                toast.success('Category deleted successfully');
            },
        });
    };

    const handleRestore = (id: number) => {
        setRestoringId(id);
        router.post(
            CategoryController.restore(id).url,
            {},
            {
                onSuccess: () => {
                    setRestoringId(null);
                    toast.success('Category restored successfully');
                },
            },
        );
    };

    const clearSearch = () => {
        setNameFilter('');
    };

    return (
        <>
            <Head title="Categories" />

            <div className="mt-3 space-y-8 px-4 sm:px-6">
                {/* Page Header */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your Product Categories for inventory
                                organization
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-800 dark:bg-emerald-950/30">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    {activeCategories.length} Active
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5">
                                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                                <span className="text-sm font-semibold text-muted-foreground">
                                    {inactiveCategories.length} Inactive
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            onClick={openCreateModal}
                            variant="primary"
                            className="w-fit gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Category
                        </Button>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search categories..."
                                    value={nameFilter}
                                    onChange={(e) =>
                                        setNameFilter(e.target.value)
                                    }
                                    className="pr-8 pl-9 sm:w-56"
                                />
                                {nameFilter && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <Select
                                value={categoryActiveFilter}
                                onValueChange={(v) =>
                                    setCategoryActiveFilter(
                                        v as '1' | '2' | '3',
                                    )
                                }
                            >
                                <SelectTrigger className="sm:w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">All</SelectItem>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="2">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Name
                                    </th>
                                    <th className="px-5 py-3.5 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Status
                                    </th>
                                    <th className="px-5 py-3.5 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Edit
                                    </th>
                                    <th className="px-5 py-3.5 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                                    <Search className="h-7 w-7 text-muted-foreground/50" />
                                                </div>
                                                <p className="font-medium text-foreground">
                                                    {nameFilter ||
                                                    categoryActiveFilter !== '3'
                                                        ? 'No categories match your filters'
                                                        : 'No categories yet'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {nameFilter ||
                                                    categoryActiveFilter !== '3'
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'Create your first category to get started'}
                                                </p>
                                                {(nameFilter ||
                                                    categoryActiveFilter !==
                                                        '3') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            clearSearch();
                                                            setCategoryActiveFilter(
                                                                '3',
                                                            );
                                                        }}
                                                    >
                                                        Clear Filters
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => {
                                        const isInactive =
                                            category.deleted_at !== null;

                                        return (
                                            <tr
                                                key={category.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <td className="px-5 py-4 font-medium text-foreground">
                                                    {category.name}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    {isInactive ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                                            Inactive
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openEditModal(
                                                                category,
                                                            )
                                                        }
                                                        disabled={isInactive}
                                                        className={
                                                            isInactive
                                                                ? 'cursor-not-allowed opacity-50'
                                                                : ''
                                                        }
                                                    >
                                                        <PenSquare className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    {isInactive ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleRestore(
                                                                    category.id,
                                                                )
                                                            }
                                                            disabled={
                                                                restoringId ===
                                                                category.id
                                                            }
                                                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                        >
                                                            <RefreshCw
                                                                className={`h-4 w-4 ${restoringId === category.id ? 'animate-spin' : ''}`}
                                                            />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    category,
                                                                )
                                                            }
                                                            className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {filteredCategories.length > 0 && (
                        <div className="border-t border-border bg-muted/30 px-5 py-3">
                            <p className="text-xs text-muted-foreground">
                                Showing {filteredCategories.length} of{' '}
                                {categories.data.length} categories
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                                ? 'Edit Category'
                                : 'Create New Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Update the category name below.'
                                : 'Add a new category to organize your inventory.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="py-4">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium text-foreground"
                            >
                                Category Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter category name"
                                className={`mt-1.5 ${errors.name ? 'border-destructive' : ''}`}
                                autoFocus
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        {editingCategory
                                            ? 'Updating...'
                                            : 'Creating...'}
                                    </span>
                                ) : editingCategory ? (
                                    'Save Changes'
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                                <Trash className="h-4 w-4 text-destructive" />
                            </span>
                            Delete Category
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;
                            {categoryToDelete?.name}&quot;? This action can be
                            undone by restoring the category from the inactive
                            list.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [{ title: 'Categories', href: CategoryController.index() }],
};
