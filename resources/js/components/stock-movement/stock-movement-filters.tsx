import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import LabeledInput from '../ui/labeled-input';

interface StockMovementFiltersProps {
    filters: { productId: string; dateFrom: string; dateTo: string };
    updateFilter: (key: keyof StockMovementFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    products: { id: number; name: string }[];
    navigate: (page?: number, overrides?: Partial<{ productId: string; dateFrom: string; dateTo: string }>) => void;
}

export function StockMovementFilters({
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    products,
}: StockMovementFiltersProps) {

    const handleApply = () => {
        if (filters.dateFrom && filters.dateTo && filters.dateTo < filters.dateFrom) {
            toast.error('Date To must be greater than or equal to Date From');

            return;
        }

        applyFilters();
    };

    return (
        <div className="flex flex-col xl:flex-row items-stretch xl:items-end gap-4 flex-1">

            <div className="w-full xl:w-40 space-y-1">
                <Label>Product</Label>
                <Select
                    value={filters.productId}
                    onValueChange={(value) => updateFilter('productId', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {products.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 w-full xl:w-auto">

                <div className="w-full xl:w-44">
                    <LabeledInput
                        type='date'
                        name="dateFrom"
                        label="Date From"
                        value={filters.dateFrom}
                        onChange={(value) => updateFilter('dateFrom', value)}
                    />
                </div>

                <div className="w-full xl:w-44">
                    <LabeledInput
                        type='date'
                        name="dateTo"
                        label="Date To"
                        value={filters.dateTo}
                        onChange={(value) => updateFilter('dateTo', value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 justify-end xl:ml-auto">
                <Button
                    variant="primary"
                    onClick={handleApply}
                    className='cursor-pointer w-full xl:w-auto'
                    title="Apply Filters"
                >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        className='cursor-pointer text-muted-foreground hover:text-destructive'
                        onClick={clearFilters}
                        size="icon"
                        title="Clear Filters"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
