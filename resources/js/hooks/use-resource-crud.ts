import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useConfirmDialog } from './use-confirm-dialog';
import { useFormDialog } from './use-form-dialog';
import { useRestore } from './use-restore';

type UseResourceCrudOptions<T extends { id: number }, TForm extends Record<string, any>> = {
    storeUrl: string;
    updateUrl: (id: number) => string;
    destroyUrl: (id: number) => string;
    restoreUrl?: (id: number) => string;
    formFields: TForm;
    getEditValues: (item: T) => Partial<TForm>;
    messages?: {
        created?: string;
        updated?: string;
        deleted?: string;
        restored?: string;
    };
};

export function useResourceCrud<T extends { id: number }, TForm extends Record<string, any>>(
    options: UseResourceCrudOptions<T, TForm>,
) {
    const { destroyUrl, restoreUrl, messages = {} } = options;

    const formDialog = useFormDialog<T, TForm>({ ...options, messages });

    const deleteDialog = useConfirmDialog<T>({
        onConfirm: (item) => {
            router.delete(destroyUrl(item.id), {
                onSuccess: () => {
                    deleteDialog.close();
                    toast.success(messages.deleted ?? 'Deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.message || 'An error occurred while deleting');
                    deleteDialog.close();
                }
            });
        },
    });

    const { restoringId, restore } = useRestore(restoreUrl, messages.restored);

    return {
        isModalOpen: formDialog.isOpen,
        setIsModalOpen: formDialog.setIsOpen,
        editingItem: formDialog.editingItem,
        openCreateModal: formDialog.openCreate,
        openEditModal: formDialog.openEdit,
        closeModal: formDialog.close,
        handleSubmit: formDialog.handleSubmit,
        form: formDialog.form,

        deleteConfirmOpen: deleteDialog.isOpen,
        setDeleteConfirmOpen: deleteDialog.setIsOpen,
        itemToDelete: deleteDialog.pendingItem,
        confirmDelete: deleteDialog.open,
        handleDelete: deleteDialog.confirm,

        restoringId,
        handleRestore: restore,
    };
}