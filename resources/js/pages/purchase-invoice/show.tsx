import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared/page-header';
import { usePermission } from '@/hooks/use-permission';
import { index as purchaseInvoicesIndex } from '@/routes/purchase-invoices';
import type { Product } from "@/types/product";
import type { PurchaseInvoice } from "@/types/purchase-invoice";
import type { Supplier } from "@/types/supplier";
import { PurchaseInvoiceForm } from '../../components/purchase-invoice/purchase-invoice-form';

type SupplierSelect = Pick<Supplier, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface ShowPurchaseInvoiceProps {
    purchase_invoice: PurchaseInvoice;
    suppliers: SupplierSelect[];
    products: ProductSelect[];
}

export default function ShowPurchaseInvoice({
    purchase_invoice,
    suppliers,
    products
}: ShowPurchaseInvoiceProps) {
    const { can } = usePermission();
    const canEdit = can('edit-purchases');
    const isConfirmed = Number(purchase_invoice.status) !== 0;

    return (
        <>
            <Head title={`Purchase Invoice ${purchase_invoice.number}`} />

            <div className="mt-3 mb-8 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description={isConfirmed || !canEdit ? "View purchase invoice details" : "View or edit purchase invoice details"}
                />

                <div className="max-w-5xl">
                    <PurchaseInvoiceForm
                        purchaseInvoice={purchase_invoice}
                        suppliers={suppliers}
                        products={products}
                    />
                </div>
            </div>
        </>
    );
}

ShowPurchaseInvoice.layout = {
    breadcrumbs: [
        {
            title: 'Purchase Invoices',
            href: purchaseInvoicesIndex().url,
        },
        {
            title: 'View',
        },
    ],
};
