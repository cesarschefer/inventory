import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Permission } from '@/types/permission';

type RolePermissionInputsProps = {
    availablePermissions: Record<string, Permission[]>;
    data: { permissions: number[] };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
};

export function RolePermissionInputs({
    availablePermissions,
    data,
    setData,
    errors,
}: RolePermissionInputsProps) {

    const togglePermission = (id: number) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(id);

        if (index > -1) {
            currentPermissions.splice(index, 1);
        } else {
            currentPermissions.push(id);
        }

        setData('permissions', currentPermissions);
    };

    return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(availablePermissions).map(([resource, permissions]) => (
                <div key={resource} className="space-y-3">
                    <h3 className="text-sm font-semibold capitalize text-foreground/70 border-b border-border/50 pb-1">
                        {resource}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={data.permissions.includes(permission.id)}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <Label
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-sm font-normal cursor-pointer capitalize"
                                >
                                    {permission.name.split('-')[0]}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {errors.permissions && (
                <p className="text-sm text-destructive">{errors.permissions}</p>
            )}
        </div>
    );
}
