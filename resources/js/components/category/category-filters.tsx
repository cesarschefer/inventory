import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CategoryFiltersProps {
    filters: { search: string; status: string };
    updateFilter: (key: keyof CategoryFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    navigate: (page?: number, overrides?: Partial<CategoryFiltersProps['filters']>) => void;
}

export function CategoryFilters({
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    navigate,
}: CategoryFiltersProps) {
    return (
        <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Search
                </Label>
                <Input
                    placeholder="Enter name..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    onBlur={applyFilters}
                />
            </div>

            <div className="w-40">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                </Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) => {
                        updateFilter('status', value);
                        navigate(1, { status: value });
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="2">Inactive</SelectItem>
                        <SelectItem value="3">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <Button
                    variant="primary"
                    className="cursor-pointer"
                    onClick={clearFilters}
                    size="icon"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
