import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
    hideTextOnMobile?: boolean;
}

export default function AppLogo({
    className,
    iconClassName,
    textClassName,
    showText = true,
    hideTextOnMobile = false,
}: AppLogoProps) {

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className={cn(
                    'flex aspect-square size-8 items-center justify-center rounded-md bg-green-500',
                    iconClassName,
                )}
            >
                <AppLogoIcon className="size-5 text-white" />
            </div>
            {showText && (
                <div
                    className={cn(
                        'grid flex-1 text-left text-sm',
                        hideTextOnMobile ? 'hidden min-[400px]:grid' : '',
                    )}
                >
                    <span
                        className={cn(
                            'truncate leading-tight font-semibold text-green-500',
                            textClassName,
                        )}
                    >
                        StockFlow
                    </span>

                </div>
            )}
        </div>
    );
}

