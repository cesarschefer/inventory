import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-right"
            closeButton
            style={
                {
                    '--normal-bg': 'var(--btn-primary)',
                    '--normal-text': 'var(--btn-primary-foreground)',
                    '--normal-border': 'var(--btn-primary)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
