import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthBackgroundLayout from '@/layouts/auth/auth-background-layout';

export default function AuthLayout({
    title = '',
    description = '',
    backgroundImage,
    children,
}: {
    title?: string;
    description?: string;
    backgroundImage?: string;
    children: React.ReactNode;
}) {
    if (backgroundImage) {
        return (
            <AuthBackgroundLayout
                title={title}
                description={description}
                backgroundImage={backgroundImage}
            >
                {children}
            </AuthBackgroundLayout>
        );
    }

    return (
        <AuthSimpleLayout title={title} description={description}>
            {children}
        </AuthSimpleLayout>
    );
}
