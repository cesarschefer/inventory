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

interface CustomerFiltersProps {
    filters: { search: string; status: string; customer_type: string; tax_id: string };
    updateFilter: (key: keyof CustomerFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    navigate: (page?: number, overrides?: Partial<{ search: string; status: string; customer_type: string; tax_id: string }>) => void;
}

export function CustomerFilters({
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    navigate,
}: CustomerFiltersProps) {
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
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer Type</Label>
                <Select
                    value={filters.customer_type}
                    onValueChange={(value) => {
                        updateFilter('customer_type', value);
                        navigate(1, { customer_type: value });
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Customer</SelectItem>
                        <SelectItem value="2">Company</SelectItem>
                        <SelectItem value="3">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tax ID</Label>
                <Input
                    placeholder="Search by tax ID..."
                    value={filters.tax_id}
                    onChange={(e) =>
                        updateFilter('tax_id', e.target.value)
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
