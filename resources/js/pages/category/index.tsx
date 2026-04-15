import { Head, router, useForm } from '@inertiajs/react';
import { PenSquare, Plus, RefreshCw, Trash } from 'lucide-react';
import { useState } from 'react';

import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const [categoryActiveFilter, setCategoryActiveFilter] = useState<'1' | '2'>('1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
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
            put(CategoryController.update(editingCategory.id).url, { onSuccess: closeModal });
        } else {
            post(CategoryController.store().url, { onSuccess: closeModal });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(CategoryController.destroy(id));
    };

    const handleRestore = (id: number) => {
        router.post(CategoryController.restore(id));
    };

    const filteredCategories = categories.data.filter((category) => {
        const nameMatch = category.name.toLowerCase().includes(nameFilter.toLowerCase());
        const isInactive = category.deleted_at !== null;
        const statusMatch =
            categoryActiveFilter === '1' ? !isInactive :
                categoryActiveFilter === '2' ? isInactive :
                    true;

        return nameMatch && statusMatch;
    });

    return (
        <>
            <Head title="Categories" />

            {/* Card wrapper */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

                {/* Top bar: button + filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Button onClick={openCreateModal} className="gap-2 w-fit">
                        <Plus className="h-4 w-4" />
                        New Category
                    </Button>

                    <div className="flex flex-col sm:flex-row gap-3 sm:w-auto w-full">
                        <Input
                            placeholder="Search by name..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="sm:w-56"
                        />
                        <Select
                            value={categoryActiveFilter}
                            onValueChange={(v) => setCategoryActiveFilter(v as '1' | '2')}
                        >
                            <SelectTrigger className="sm:w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="2">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wide">
                                <th className="px-5 py-3 text-left font-medium">Name</th>
                                {categoryActiveFilter === '1' && (
                                    <th className="px-5 py-3 text-center font-medium w-24">Edit</th>
                                )}
                                <th className="px-5 py-3 text-center font-medium w-24">
                                    {categoryActiveFilter === '2' ? 'Restore' : 'Delete'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={categoryActiveFilter === '1' ? 3 : 2}
                                        className="px-5 py-10 text-center text-gray-400"
                                    >
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 text-gray-800 font-medium">
                                            {category.name}
                                        </td>
                                        {categoryActiveFilter === '1' && (
                                            <td className="px-5 py-3 text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(category)}
                                                >
                                                    <PenSquare className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        )}
                                        <td className="px-5 py-3 text-center">
                                            {category.deleted_at ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRestore(category.id)}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Categories', href: CategoryController.index() },
    ],
};