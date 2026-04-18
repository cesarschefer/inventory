import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseResourceCrudOptions<T extends { id: number }, TForm extends Record<string, any>> = {
    storeUrl: string;
    updateUrl: (id: number) => string;
    destroyUrl: (id: number) => string;
    restoreUrl?: (id: number) => string; // opcional — solo para entidades con soft-delete
    formFields: TForm;
    getEditValues: (item: T) => Partial<TForm>;
    messages?: {
        created?: string;
        updated?: string;
        deleted?: string;
        restored?: string;
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResourceCrud<T extends { id: number }, TForm extends Record<string, any>>({
    storeUrl,
    updateUrl,
    destroyUrl,
    restoreUrl,
    formFields,
    getEditValues,
    messages = {},
}: UseResourceCrudOptions<T, TForm>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<TForm>(formFields);

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: T) => {
        // Merge defaults con los valores del item para asegurar que TForm esté completo
        setData({ ...formFields, ...getEditValues(item) } as TForm);
        clearErrors();
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            put(updateUrl(editingItem.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success(messages.updated ?? 'Updated successfully');
                },
            });
        } else {
            post(storeUrl, {
                onSuccess: () => {
                    closeModal();
                    toast.success(messages.created ?? 'Created successfully');
                },
            });
        }
    };

    const confirmDelete = (item: T) => {
        setItemToDelete(item);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(destroyUrl(itemToDelete.id), {
            onSuccess: () => {
                setDeleteConfirmOpen(false);
                setItemToDelete(null);
                toast.success(messages.deleted ?? 'Deleted successfully');
            },
        });
    };

    const handleRestore = (id: number) => {
        if (!restoreUrl) return;

        setRestoringId(id);
        router.post(
            restoreUrl(id),
            {},
            {
                onSuccess: () => {
                    setRestoringId(null);
                    toast.success(messages.restored ?? 'Restored successfully');
                },
            },
        );
    };

    return {
        isModalOpen,
        setIsModalOpen,
        editingItem,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        itemToDelete,
        restoringId,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        confirmDelete,
        handleDelete,
        handleRestore,
        form: { data, setData, processing, errors },
    };
}
