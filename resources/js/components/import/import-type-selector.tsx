import { cn } from '@/lib/utils';
import { IMPORT_TYPES  } from '@/types/import';
import type {ImportTypeValue} from '@/types/import';

interface ImportTypeSelectorProps {
    value: ImportTypeValue;
    onChange: (type: ImportTypeValue) => void;
}

export function ImportTypeSelector({ value, onChange }: ImportTypeSelectorProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {IMPORT_TYPES.map(({ value: type, label, icon: Icon }) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => onChange(type)}
                    className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-center transition-all cursor-pointer',
                        value === type
                            ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950/30'
                            : 'border-border bg-muted/40 hover:border-border/80 hover:bg-muted/60'
                    )}
                >
                    <Icon
                        className={cn(
                            'h-5 w-5',
                            value === type
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground'
                        )}
                    />
                    <p className={cn(
                        'text-sm font-medium',
                        value === type
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-foreground'
                    )}>
                        {label}
                    </p>
                </button>
            ))}
        </div>
    );
}