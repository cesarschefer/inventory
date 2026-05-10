import { Separator } from '@/components/ui/separator';
import type { Role } from '@/types/role';
import { RoleItem } from './role-item';

type UserRoleInputsProps = {
    data: { roles: number[] };
    setData: (key: string, value: any) => void;
    availableRoles: Role[];
    errors: Partial<Record<string, string>>;
};

export function UserRoleInputs({
    data,
    setData,
    availableRoles,
    errors
}: UserRoleInputsProps) {
    const adminRole = availableRoles.find((role) => role.name === 'Administrator');
    const otherRoles = availableRoles.filter((role) => role.name !== 'Administrator');

    const toggleRole = (roleId: number) => {
        let currentRoles = [...data.roles];
        const isAdmin = roleId === adminRole?.id;

        if (isAdmin) {
            currentRoles = currentRoles.includes(roleId) ? [] : [roleId];
        } else {
            const adminId = adminRole?.id;

            if (adminId && currentRoles.includes(adminId)) {
                currentRoles = currentRoles.filter(id => id !== adminId);
            }

            const index = currentRoles.indexOf(roleId);

            if (index > -1) {
                currentRoles.splice(index, 1);
            } else {
                currentRoles.push(roleId);
            }
        }

        setData('roles', currentRoles);
    };

    return (
        <div className="grid gap-6">
            {adminRole && (
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                        Total Access
                    </h4>
                    <RoleItem
                        role={adminRole}
                        checked={data.roles.includes(adminRole.id)}
                        onCheckedChange={() => toggleRole(adminRole.id)}
                    />
                </div>
            )}

            {adminRole && otherRoles.length > 0 && <Separator />}

            {otherRoles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                        Standard Access
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {otherRoles.map((role) => (
                            <RoleItem
                                key={role.id}
                                role={role}
                                checked={data.roles.includes(role.id)}
                                onCheckedChange={() => toggleRole(role.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {errors.roles && (
                <p className="text-sm text-destructive">{errors.roles}</p>
            )}
        </div>
    );
}
