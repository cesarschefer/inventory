import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
import { usePermission } from '@/hooks/use-permission';
import { exportMethod } from '@/routes/reports';
import LabeledInput from '../ui/labeled-input';

interface ReportsFiltersProps {
    filters: { report_type: string; date_from: string; date_to: string; };
    updateFilter: (key: keyof ReportsFiltersProps['filters'], value: string) => void;
}

export function ReportsFilters({
    filters,
    updateFilter,
}: ReportsFiltersProps) {
    const { can } = usePermission();
    const canExport = can('export-reports');
    const [loadingFormat, setLoadingFormat] = useState<'excel' | 'pdf' | null>(null);

    const handleExport = async (format: 'excel' | 'pdf') => {
        setLoadingFormat(format);

        try {
            const url = exportMethod.url({ query: { ...filters, format } });
            const response = await fetch(url);

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                const message = data?.message ?? 'An error occurred while generating the report.';
                toast.error(message);

                return;
            }

            // Ensure the response is actually a file (not an HTML/JSON error page)
            const contentType = response.headers.get('Content-Type') ?? '';
            const isFile = contentType.includes('application/') || contentType.includes('octet-stream');

            if (!isFile) {
                toast.error('An error occurred while generating the report.');

                return;
            }

            const blob = await response.blob();

            const disposition = response.headers.get('Content-Disposition');
            let filename = `report.${format === 'excel' ? 'xlsx' : 'pdf'}`;

            if (disposition) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);

                if (match) {
filename = match[1].replace(/['"]/g, '');
}
            }

            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        } catch {
            toast.error('Could not connect to the server. Please try again.');
        } finally {
            setLoadingFormat(null);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row items-stretch xl:items-end gap-4 flex-1">

            <div className="w-full xl:w-40 space-y-1">
                <Label>Report Type</Label>
                <Select
                    value={filters.report_type}
                    onValueChange={(value) => updateFilter('report_type', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="purchases">Purchases</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="profit">Profits</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 w-full xl:w-auto">

                <div className="w-full xl:w-44">
                    <LabeledInput
                        type='date'
                        name="date_from"
                        label="Date From"
                        value={filters.date_from}
                        onChange={(value) => updateFilter('date_from', value)}
                    />
                </div>

                <div className="w-full xl:w-44">
                    <LabeledInput
                        type='date'
                        name="date_to"
                        label="Date To"
                        value={filters.date_to}
                        onChange={(value) => updateFilter('date_to', value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 justify-end xl:ml-auto">
                <Button
                    variant="outline"
                    onClick={() => handleExport('excel')}
                    disabled={loadingFormat !== null || !canExport}
                    className='cursor-pointer w-full xl:w-auto border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {loadingFormat === 'excel'
                        ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        : <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />}
                    {loadingFormat === 'excel' ? 'Exporting…' : 'Excel'}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                    disabled={loadingFormat !== null || !canExport}
                    className='cursor-pointer w-full xl:w-auto border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {loadingFormat === 'pdf'
                        ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        : <FileText className="h-4 w-4 mr-2 text-rose-600" />}
                    {loadingFormat === 'pdf' ? 'Exporting…' : 'PDF'}
                </Button>
            </div>
        </div>
    );
}
