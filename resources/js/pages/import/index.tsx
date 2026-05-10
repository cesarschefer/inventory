import { Head } from '@inertiajs/react';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { ImportSchemaTable } from '@/components/import/import-schema-table';
import { ImportTypeSelector } from '@/components/import/import-type-selector';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useImport } from '@/hooks/use-import';
import { index as importIndex } from '@/routes/import';

export default function ImportIndex() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        importType,
        file,
        loading,
        result,
        handleTypeChange,
        handleFile,
        removeFile,
        runImport,
    } = useImport();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];

        if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
            handleFile(droppedFile);
        }
    };

    // Resets the native input value so the same file (or a new one)
    // can be selected again after removing — without this, onChange won't fire.
    const handleRemove = () => {
        removeFile();

        if (fileInputRef.current) {
fileInputRef.current.value = '';
}
    };

    return (
        <>
            <Head title="Import" />

            <div className="mt-3 mb-4 space-y-6 px-4 sm:px-6">
                <PageHeader
                    description="Import your products, categories, suppliers or customers from a CSV file."
                />
                <ImportTypeSelector
                    value={importType}
                    onChange={handleTypeChange}
                />
                <div>
                    <h2 className="text-sm font-medium mb-2">Expected columns for {importType}</h2>
                    <ImportSchemaTable importType={importType} />
                </div>
                <div>
                    <label className="text-sm font-medium">CSV File</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={(e) => {
                            const f = e.target.files?.[0];

                            if (f) {
handleFile(f);
}
                        }}
                    />

                    {file ? (
                        <div className="mt-1.5 flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="mt-1.5 flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload</p>
                            <p className="text-xs text-muted-foreground">CSV files only</p>
                        </div>
                    )}
                </div>

                <Button
                    variant="primary"
                    className="w-full cursor-pointer"
                    onClick={runImport}
                    disabled={!file || loading}
                >
                    {loading ? 'Importing...' : 'Import'}
                </Button>

                {result && (
                    <div className="rounded-md border p-4 space-y-3">
                        <h3 className="text-sm font-medium">Import Result</h3>
                        <div className="flex gap-3">
                            <Badge variant="default">{result.imported} imported</Badge>
                            {result.skipped > 0 && (
                                <Badge variant="secondary">{result.skipped} skipped</Badge>
                            )}
                        </div>
                        {result.errors.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-destructive">Rows with errors:</p>
                                {result.errors.map((error, index) => (
                                    <p key={`${importType}-row-${error.row}-${index}`} className="text-sm text-destructive">
                                        Row {error.row}: {error.errors.join(', ')}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

ImportIndex.layout = {
    breadcrumbs: [
        {
            title: 'Import',
            href: importIndex(),
        },
    ],
};