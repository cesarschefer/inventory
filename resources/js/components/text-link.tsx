import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'text-green-400 underline decoration-green-400/50 underline-offset-4',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
