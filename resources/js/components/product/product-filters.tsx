import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/category';

interface ProductFiltersProps {
    filters: { search: string; status: string; sku: string, category_id: string };
    categories: Category[];
    updateFilter: (key: keyof ProductFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    navigate: (page?: number, overrides?: Partial<{ search: string; status: string; sku: string, category_id: string }>) => void;
}

export function ProductFilters({
    filters,
    categories,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    navigate,
}: ProductFiltersProps) {
    return (
        <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</Label>
                <Input
                    placeholder="Search by name..."
                    value={filters.search}
                    onChange={(e) =>
                        updateFilter('search', e.target.value)
                    }
                    onBlur={applyFilters}
                />
            </div>

            <div className="w-40">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</Label>
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

            <div className="w-40">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
                <Select
                    value={filters.category_id}
                    onValueChange={(value) => {
                        updateFilter('category_id', value);
                        navigate(1, { category_id: value });
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</Label>
                <Input
                    placeholder="Search by SKU..."
                    value={filters.sku}
                    onChange={(e) =>
                        updateFilter('sku', e.target.value)
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
