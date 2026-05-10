import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SCHEMAS  } from '@/types/import';
import type {ImportTypeValue} from '@/types/import';

const buildCsvTemplate = (type: ImportTypeValue): string => {
    const columns = SCHEMAS[type].map(c => c.column);

    return columns.join(',') + '\n';
};

const downloadTemplate = (type: ImportTypeValue) => {
    const csv = buildCsvTemplate(type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

interface ImportSchemaTableProps {
    importType: ImportTypeValue;
}

export function ImportSchemaTable({ importType }: ImportSchemaTableProps) {
    const columns = SCHEMAS[importType];

    return (
        <div className="space-y-3">
            <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Column</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Required</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground hidden sm:table-cell">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((col, i) => (
                            <tr key={`${importType}-${col.column}`} className={i < columns.length - 1 ? 'border-b' : ''}>
                                <td className="px-3 py-2">
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                        {col.column}
                                    </code>
                                </td>
                                <td className="px-3 py-2 text-muted-foreground">{col.type}</td>
                                <td className="px-3 py-2">
                                    {col.required ? (
                                        <Badge variant="destructive" className="text-xs font-normal">required</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs font-normal">optional</Badge>
                                    )}
                                </td>
                                <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{col.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => downloadTemplate(importType)}
            >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download {importType} template
            </Button>
        </div>
    );
}
