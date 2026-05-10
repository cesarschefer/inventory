import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function useRestore(
    restoreUrl?: (id: number) => string,
    successMessage?: string
) {
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const restore = (id: number) => {
        if (!restoreUrl) {
return;
}

        setRestoringId(id);
        router.post(restoreUrl(id), {}, {
            onSuccess: () => {
                setRestoringId(null);
                toast.success(successMessage ?? 'Restored successfully');
            },
            onError: (errors) => {
                setRestoringId(null);
                toast.error(errors.message || 'An error occurred while restoring');
            },
        });
    };

    return { restoringId, restore };
}