import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

type UseFormDialogOptions<T extends { id: number }, TForm extends Record<string, any>> = {
    storeUrl: string;
    updateUrl: (id: number) => string;
    formFields: TForm;
    getEditValues: (item: T) => Partial<TForm>;
    messages?: { created?: string; updated?: string };
};

export function useFormDialog<T extends { id: number }, TForm extends Record<string, any>>({
    storeUrl,
    updateUrl,
    formFields,
    getEditValues,
    messages = {},
}: UseFormDialogOptions<T, TForm>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const { data, setData, post, put, transform, processing, errors, reset, clearErrors } =
        useForm<TForm>(formFields);

    const openCreate = () => {
        transform((data) => data); // resets transform, laravel spoofing
        reset();
        clearErrors();
        setEditingItem(null);
        setIsOpen(true);
    };

    const openEdit = (item: T) => {
        transform((data) => data);
        setData({ ...formFields, ...getEditValues(item) } as TForm);
        clearErrors();
        setEditingItem(item);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setEditingItem(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            const hasFiles = Object.values(data).some((value) => value instanceof File);

            if (hasFiles) {
                transform((data) => ({
                    ...data,
                    _method: 'put', // laravel spoofing
                }));
                post(updateUrl(editingItem.id), {
                    onSuccess: () => {
                        close();
                        toast.success(messages.updated ?? 'Updated successfully');
                    },
                });
            } else {
                put(updateUrl(editingItem.id), {
                    onSuccess: () => {
                        close();
                        toast.success(messages.updated ?? 'Updated successfully');
                    },
                });
            }
        } else {
            post(storeUrl, {
                onSuccess: () => {
                    close();
                    toast.success(messages.created ?? 'Created successfully');
                },
            });
        }
    };

    return {
        isOpen,
        setIsOpen,
        editingItem,
        openCreate,
        openEdit,
        close,
        handleSubmit,
        form: { data, setData, processing, errors },
    };
}