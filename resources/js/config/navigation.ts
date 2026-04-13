import type { NavItem } from '@/types';
import { HomeIcon, ShieldCheckIcon, UserIcon, BriefcaseIcon, TagIcon, Store, ShoppingCart, ClipboardListIcon, BanknoteIcon, ArrowRightLeftIcon, ChartBarIcon } from 'lucide-react';
import { dashboard } from '@/routes';

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
        href: dashboard(),
        icon: TagIcon,
    },
    {
        title: 'Suppliers',
        href: dashboard(),
        icon: Store,
    },
    {
        title: 'Products',
        href: dashboard(),
        icon: ShoppingCart,
    },
    {
        title: 'Purchase Invoices',
        href: dashboard(),
        icon: ClipboardListIcon,
    },
    {
        title: 'Sale Invoices',
        href: dashboard(),
        icon: BanknoteIcon,
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