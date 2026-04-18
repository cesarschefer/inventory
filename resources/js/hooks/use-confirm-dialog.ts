import { useState } from 'react';

type UseConfirmDialogOptions<T> = {
    onConfirm: (item: T) => void;
};

export function useConfirmDialog<T>({ onConfirm }: UseConfirmDialogOptions<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<T | null>(null);

    const open = (item: T) => {
        setPendingItem(item);
        setIsOpen(true);
    };

    const confirm = () => {
        if (!pendingItem) return;
        onConfirm(pendingItem);
    };

    const cancel = () => {
        setIsOpen(false);
        setPendingItem(null);
    };

    const close = () => {
        setIsOpen(false);
        setPendingItem(null);
    };

    return { isOpen, setIsOpen, pendingItem, open, confirm, cancel, close };
}