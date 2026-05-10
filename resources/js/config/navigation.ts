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
    ChartBarIcon,
    UploadIcon
} from 'lucide-react';
import { dashboard } from '@/routes';
import categories from '@/routes/categories';
import customers from '@/routes/customers';
import imports from '@/routes/import';
import products from '@/routes/products';
import purchaseInvoices from '@/routes/purchase-invoices';
import reports from '@/routes/reports';
import roles from '@/routes/roles';
import saleInvoices from '@/routes/sale-invoices';
import stockMovements from '@/routes/stock-movements';
import suppliers from '@/routes/suppliers';
import users from '@/routes/users';
import type { NavItem } from '@/types';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: HomeIcon,
    },
    {
        title: 'Users',
        href: users.index(),
        icon: UserIcon,
        permission: 'manage-users',
    },
    {
        title: 'Roles and Permissions',
        href: roles.index(),
        icon: ShieldCheckIcon,
        permission: 'manage-roles',
    },
    {
        title: 'Customers',
        href: customers.index(),
        icon: BriefcaseIcon,
        permission: 'view-customers',
    },
    {
        title: 'Categories',
        href: categories.index(),
        icon: TagIcon,
        permission: 'view-categories',
    },
    {
        title: 'Suppliers',
        href: suppliers.index(),
        icon: Truck,
        permission: 'view-suppliers',
    },
    {
        title: 'Products',
        href: products.index(),
        icon: ShoppingCart,
        permission: 'view-products',
    },
    {
        title: 'Purchase Invoices',
        href: purchaseInvoices.index(),
        icon: FileText,
        permission: 'view-purchases',
    },
    {
        title: 'Sale Invoices',
        href: saleInvoices.index(),
        icon: DollarSign,
        permission: 'view-sales',
    },
    {
        title: 'Stock Movements',
        href: stockMovements.index(),
        icon: ArrowRightLeftIcon,
        permission: 'view-stock-movements',
    },
    {
        title: 'Reports',
        href: reports.index(),
        icon: ChartBarIcon,
        permission: 'view-reports',
    },
    {
        title: 'Import',
        href: imports.index(),
        icon: UploadIcon,
        permission: 'import-data',
    },
];