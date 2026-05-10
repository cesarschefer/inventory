import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserFiltersProps {
    filters: { name: string; email: string; }
    updateFilter: (key: keyof UserFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function UserFilters({
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
}: UserFiltersProps) {
    return (
        <div className="flex w-full items-end justify-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
                <Input
                    placeholder="Enter name..."
                    value={filters.name}
                    onChange={(e) =>
                        updateFilter('name', e.target.value)
                    }
                    onBlur={applyFilters}
                />
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                <Input
                    placeholder="Enter email..."
                    value={filters.email}
                    onChange={(e) =>
                        updateFilter('email', e.target.value)
                    }
                    onBlur={applyFilters}
                />
            </div>

            {hasActiveFilters && (
                <Button
                    variant="primary"
                    className='cursor-pointer'
                    onClick={clearFilters}
                    size="icon"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
