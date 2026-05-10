import { RefreshCw } from 'lucide-react';
import type { ReactNode, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type FormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submitVariant?:
    | 'default'
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'secondary';
    title: string;
    description?: string;
    icon?: ReactNode;

    children: ReactNode;

    onSubmit: (e: FormEvent<HTMLFormElement>) => void;

    submitLabel?: string;
    submitLoading?: boolean;
    submitLoadingLabel?: string;

    cancelLabel?: string;
    onCancel?: () => void;
    disableCancel?: boolean;
    maxWidth?: string;
};

export function FormDialog({
    open,
    onOpenChange,
    submitVariant = 'primary',
    title,
    description,
    icon,
    children,
    onSubmit,
    submitLabel = 'Save',
    submitLoading = false,
    submitLoadingLabel,
    cancelLabel = 'Cancel',
    onCancel,
    disableCancel = false,
    maxWidth = 'sm:max-w-md',
}: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={maxWidth}>
                <DialogHeader>
                    <DialogTitle
                        className={icon ? 'flex items-center gap-2' : undefined}
                    >
                        {icon && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {icon}
                            </span>
                        )}
                        {title}
                    </DialogTitle>
                    {description ? (
                        <DialogDescription>{description}</DialogDescription>
                    ) : (
                        <DialogDescription className="sr-only">
                            {title}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={onSubmit}>
                    <div className="py-4">{children}</div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className='cursor-pointer'
                            onClick={onCancel}
                            disabled={disableCancel || submitLoading}
                        >
                            {cancelLabel}
                        </Button>

                        <Button
                            type="submit"
                            variant={submitVariant ?? 'primary'}
                            disabled={submitLoading}
                            className='cursor-pointer'
                        >
                            {submitLoading ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    {submitLoadingLabel ?? submitLabel}
                                </span>
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}