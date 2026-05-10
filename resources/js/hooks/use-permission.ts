import { usePage } from '@inertiajs/react';
import type { PermissionName } from '@/types/permission';

export function usePermission() {
    const { auth } = usePage().props;

    const can = (
        permission: PermissionName | PermissionName[],
        mode: 'any' | 'all' = 'any'
    ): boolean => {
        if (!auth.user || !auth.permissions) {
return false;
}

        if (Array.isArray(permission)) {
            return mode === 'all'
                ? permission.every(p => auth.permissions.includes(p))
                : permission.some(p => auth.permissions.includes(p));
        }

        return auth.permissions.includes(permission);
    };

    return { can };
}
