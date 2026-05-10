import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Role } from '@/types/role';

type RoleItemProps = {
    role: Role;
    checked: boolean;
    onCheckedChange: () => void;
};

export function RoleItem({
    role,
    checked,
    onCheckedChange
}: RoleItemProps) {
    return (
        <div
            className="flex items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm transition-colors hover:bg-muted/50"
        >
            <Checkbox
                id={`role-${role.id}`}
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="cursor-pointer"
            />
            <div className="grid gap-1.5 leading-none flex-1">
                <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm font-medium leading-none cursor-pointer select-none py-1"
                >
                    {role.name}
                </Label>

            </div>
        </div>
    );
}
