import { Package, FolderOpen, Factory, Users } from 'lucide-react';

export const IMPORT_TYPES = [
    { value: 'products', label: 'Products', icon: Package },
    { value: 'categories', label: 'Categories', icon: FolderOpen },
    { value: 'suppliers', label: 'Suppliers', icon: Factory },
    { value: 'customers', label: 'Customers', icon: Users },
] as const;

export type ImportTypeValue = (typeof IMPORT_TYPES)[number]['value'];

export interface SchemaColumn {
    column: string;
    type: string;
    required: boolean;
    notes: string;
}

export const SCHEMAS: Record<ImportTypeValue, SchemaColumn[]> = {
    products: [
        { column: 'name', type: 'text', required: true, notes: 'Product display name' },
        { column: 'sku', type: 'text', required: true, notes: 'Unique identifier across all products' },
        { column: 'category', type: 'text', required: true, notes: 'Must match an existing category name (case-insensitive)' },
        { column: 'detail', type: 'text', required: false, notes: 'Optional product description' },
    ],
    categories: [
        { column: 'name', type: 'text', required: true, notes: 'Category name' },
    ],
    suppliers: [
        { column: 'name', type: 'text', required: true, notes: 'Contact or Company name' },
        { column: 'tax_id', type: 'text', required: true, notes: 'Tax ID' },
        { column: 'email', type: 'email', required: true, notes: 'Must be a valid, unique email address' },
        { column: 'phone', type: 'text', required: false, notes: 'Contact phone number' },
        { column: 'state', type: 'text', required: false, notes: 'State' },
        { column: 'city', type: 'text', required: false, notes: 'City' },
        { column: 'address', type: 'text', required: false, notes: 'Physical address' },
    ],
    customers: [
        { column: 'name', type: 'text', required: true, notes: 'Full name' },
        { column: 'customer_type', type: 'text', required: true, notes: '1 for individuals, 2 for companies' },
        { column: 'email', type: 'email', required: true, notes: 'Must be a valid, unique email address' },
        { column: 'tax_id', type: 'text', required: true, notes: 'Required for companies' },
        { column: 'phone', type: 'text', required: false, notes: 'Phone number' },
        { column: 'state', type: 'text', required: false, notes: 'State' },
        { column: 'city', type: 'text', required: false, notes: 'City' },
        { column: 'address', type: 'text', required: false, notes: 'Delivery or billing address' },
        { column: 'floor', type: 'text', required: false, notes: 'Floor' },
        { column: 'apartment', type: 'text', required: false, notes: 'Apartment number' },
    ],
};

export interface ImportError {
    row: number;
    errors: string[];
}

export interface ImportResult {
    imported: number;
    skipped: number;
    errors: ImportError[];
}
