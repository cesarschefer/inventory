import type { NavItem } from '@/types';
import {
    HomeIcon,
    ShieldCheckIcon,
    UserIcon,
    BriefcaseIcon,
    TagIcon,
    Truck,
    ShoppingCart,
    FileText,
    DollarSign,
    ArrowRightLeftIcon,
    ChartBarIcon
} from 'lucide-react';
import { dashboard } from '@/routes';
import categories from '@/routes/categories';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: HomeIcon,
    },
    {
        title: 'Roles and Permissions',
        href: dashboard(),
        icon: ShieldCheckIcon,
    },
    {
        title: 'Users',
        href: dashboard(),
        icon: UserIcon,
    },
    {
        title: 'Customers',
        href: dashboard(),
        icon: BriefcaseIcon,
    },
    {
        title: 'Categories',
        href: categories.index(),
        icon: TagIcon,
    },
    {
        title: 'Suppliers',
        href: dashboard(),
        icon: Truck,
    },
    {
        title: 'Products',
        href: dashboard(),
        icon: ShoppingCart,
    },
    {
        title: 'Purchase Invoices',
        href: dashboard(),
        icon: FileText,
    },
    {
        title: 'Sale Invoices',
        href: dashboard(),
        icon: DollarSign,
    },
    {
        title: 'Stock Movements',
        href: dashboard(),
        icon: ArrowRightLeftIcon,
    },
    {
        title: 'Reports',
        href: dashboard(),
        icon: ChartBarIcon,
    },
];