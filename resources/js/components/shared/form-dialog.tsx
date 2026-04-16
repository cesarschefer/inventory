import { ReactNode, FormEvent } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

type DialogAction = {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?:
        | 'default'
        | 'primary'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | 'link'
        | 'secondary';
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    icon?: ReactNode;
};

type FormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    icon?: ReactNode;
    children?: ReactNode;
    actions: DialogAction[];
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    icon,
    children,
    actions,
    onSubmit,
}: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle
                        className={icon ? 'flex items-center gap-2' : undefined}
                    >
                        {icon && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                                {icon}
                            </span>
                        )}
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                {onSubmit ? (
                    <form onSubmit={onSubmit}>
                        {children && <div className="py-4">{children}</div>}
                        <DialogFooter className="gap-2 sm:justify-end">
                            {actions.map((action, i) => (
                                <Button
                                    key={i}
                                    type={action.type ?? 'button'}
                                    variant={action.variant ?? 'default'}
                                    onClick={action.onClick}
                                    disabled={action.disabled || action.loading}
                                    className="cursor-pointer"
                                >
                                    {action.loading ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            {action.loadingLabel ??
                                                action.label}
                                        </span>
                                    ) : (
                                        <>
                                            {action.icon}
                                            {action.label}
                                        </>
                                    )}
                                </Button>
                            ))}
                        </DialogFooter>
                    </form>
                ) : (
                    <>
                        {children && <div className="py-4">{children}</div>}
                        <DialogFooter className="gap-2 sm:justify-end">
                            {actions.map((action, i) => (
                                <Button
                                    key={i}
                                    type={action.type ?? 'button'}
                                    variant={action.variant ?? 'default'}
                                    onClick={action.onClick}
                                    disabled={action.disabled || action.loading}
                                    className="cursor-pointer"
                                >
                                    {action.loading ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            {action.loadingLabel ??
                                                action.label}
                                        </span>
                                    ) : (
                                        <>
                                            {action.icon}
                                            {action.label}
                                        </>
                                    )}
                                </Button>
                            ))}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
