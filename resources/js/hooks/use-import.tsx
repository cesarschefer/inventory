import { useState } from 'react';
import { toast } from 'sonner';

import type { ImportTypeValue, ImportResult } from '@/types/import';

export function useImport() {
    const [importType, setImportType] = useState<ImportTypeValue>('products');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);

    const handleTypeChange = (type: ImportTypeValue) => {
        setImportType(type);
        setFile(null);
        setResult(null);
    };

    const handleFile = (f: File) => {
        setFile(f);
        setResult(null);
    };

    const removeFile = () => {
        setFile(null);
        setResult(null);
    };

    const runImport = async () => {
        if (!file) {
return;
}

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('import_type', importType);
        formData.append('file', file);

        try {
            const response = await fetch('/import', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data?.message ?? 'An error occurred during import.');

                return;
            }

            setResult(data);

            if (data.skipped === 0) {
                toast.success(`All ${data.imported} records imported successfully.`);
            } else {
                toast.warning(`${data.imported} imported, ${data.skipped} skipped.`);
            }
        } catch {
            toast.error('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        importType,
        file,
        loading,
        result,
        handleTypeChange,
        handleFile,
        removeFile,
        runImport,
    };
}