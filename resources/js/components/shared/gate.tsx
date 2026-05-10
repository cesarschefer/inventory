import React from 'react';
import { usePermission } from '@/hooks/use-permission';
import type { PermissionName } from '@/types/permission';

interface ChildProps {
    disabled?: boolean;
    onClick?: React.MouseEventHandler | undefined;
    className?: string;
}

interface GateProps {
    permission: PermissionName | PermissionName[];
    mode?: 'any' | 'all';
    children: React.ReactElement<ChildProps>;
}

export function Gate({ permission, mode = 'any', children }: GateProps) {
    const { can } = usePermission();

    if (!can(permission, mode)) {
        return React.cloneElement(children, {
            disabled: true,
            onClick: undefined,
            className: `${children.props.className ?? ''} cursor-not-allowed opacity-50`.trim(),
        });
    }

    return <>{children}</>;
}