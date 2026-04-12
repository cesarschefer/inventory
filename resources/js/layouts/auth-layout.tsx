import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthCenteredLayout from '@/layouts/auth/auth-centered-layout';

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
            <AuthCenteredLayout
                title={title}
                description={description}
                backgroundImage={backgroundImage}
            >
                {children}
            </AuthCenteredLayout>
        );
    }

    return (
        <AuthSimpleLayout title={title} description={description}>
            {children}
        </AuthSimpleLayout>
    );
}
