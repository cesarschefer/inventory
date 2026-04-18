import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function useRestore(restoreUrl: (id: number) => string, message?: string) {
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const restore = (id: number) => {
        setRestoringId(id);
        router.post(restoreUrl(id), {}, {
            onSuccess: () => {
                setRestoringId(null);
                toast.success(message ?? 'Restored successfully');
            },
            onError: () => setRestoringId(null),
        });
    };

    return { restoringId, restore };
}