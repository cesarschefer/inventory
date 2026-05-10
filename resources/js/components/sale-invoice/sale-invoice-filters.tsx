import { Search, X } from 'lucide-react';
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
import LabeledInput from '../ui/labeled-input';

interface SaleInvoiceFiltersProps {
    filters: { number: string; dateFrom: string; dateTo: string; status: string; };
    updateFilter: (key: keyof SaleInvoiceFiltersProps['filters'], value: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    navigate: (page?: number, overrides?: Partial<{ number: string; dateFrom: string; dateTo: string; status: string; }>) => void;
}

export function SaleInvoiceFilters({
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
}: SaleInvoiceFiltersProps) {
    return (
        <div className="flex flex-col xl:flex-row items-stretch xl:items-end gap-4 flex-1">
            <div className="w-full xl:w-72 space-y-1">
                <Label>Search</Label>
                <Input
                    placeholder="Invoice number..."
                    value={filters.number}
                    onChange={(e) => updateFilter('number', e.target.value)}
                />
            </div>

            <div className="w-full xl:w-40 space-y-1">
                <Label>Status</Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) => updateFilter('status', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="0">Created</SelectItem>
                        <SelectItem value="1">Confirmed</SelectItem>
                        <SelectItem value="2">Cancelled</SelectItem>
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
                    onClick={applyFilters}
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
