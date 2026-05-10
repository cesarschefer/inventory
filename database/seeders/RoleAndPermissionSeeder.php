<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // System
            'manage-users',
            'manage-roles',

            // Catalog
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',

            'view-products',
            'create-products',
            'edit-products',
            'delete-products',

            // Stakeholders
            'view-customers',
            'create-customers',
            'edit-customers',
            'delete-customers',

            'view-suppliers',
            'create-suppliers',
            'edit-suppliers',
            'delete-suppliers',

            // Transactions
            'view-sales',
            'create-sales',
            'edit-sales',
            'delete-sales',

            'view-purchases',
            'create-purchases',
            'edit-purchases',
            'delete-purchases',

            // Operations
            'view-stock-movements',
            'import-data',

            // Reporting
            'view-reports',
            'export-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Create roles and assign permissions

        // Administrator: Full access
        $adminRole = Role::findOrCreate('Administrator');
        $adminRole->syncPermissions(Permission::all());

        // Inventory Manager
        $inventoryManagerRole = Role::findOrCreate('Inventory Manager');
        $inventoryManagerRole->syncPermissions([
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'view-stock-movements',
            'view-reports',
            'export-reports',
        ]);

        // Sales Representative
        $salesRepRole = Role::findOrCreate('Sales Representative');
        $salesRepRole->syncPermissions([
            'view-customers',
            'create-customers',
            'edit-customers',
            'delete-customers',
            'view-sales',
            'create-sales',
            'edit-sales',
            'delete-sales',
            'view-products',
            'view-categories',
        ]);

        // Purchasing Agent
        $purchasingAgentRole = Role::findOrCreate('Purchasing Agent');
        $purchasingAgentRole->syncPermissions([
            'view-suppliers',
            'create-suppliers',
            'edit-suppliers',
            'delete-suppliers',
            'view-purchases',
            'create-purchases',
            'edit-purchases',
            'delete-purchases',
            'view-products',
            'view-categories',
        ]);

        // Auditor
        $auditorRole = Role::findOrCreate('Auditor');
        $auditorRole->syncPermissions([
            'view-products',
            'view-categories',
            'view-customers',
            'view-suppliers',
            'view-stock-movements',
            'view-reports',
            'view-sales',
            'view-purchases',
            'export-reports',
        ]);

        // Standard User (Normal)
        $standardRole = Role::findOrCreate('Standard User');
        $standardRole->syncPermissions([
            'view-products',
            'view-categories',
        ]);
    }
}
