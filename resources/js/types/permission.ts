export type Permission = {
    id: number;
    name: string;
};

export type PermissionName = 
    | 'manage-users'
    | 'manage-roles'
    | 'view-categories' | 'create-categories' | 'edit-categories' | 'delete-categories'
    | 'view-products' | 'create-products' | 'edit-products' | 'delete-products'
    | 'view-customers' | 'create-customers' | 'edit-customers' | 'delete-customers'
    | 'view-suppliers' | 'create-suppliers' | 'edit-suppliers' | 'delete-suppliers'
    | 'view-sales' | 'create-sales' | 'edit-sales' | 'delete-sales'
    | 'view-purchases' | 'create-purchases' | 'edit-purchases' | 'delete-purchases'
    | 'view-stock-movements' | 'import-data'
    | 'view-reports' | 'export-reports';