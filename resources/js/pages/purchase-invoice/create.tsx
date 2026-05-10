import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared/page-header';
import { index as purchaseInvoicesIndex } from '@/routes/purchase-invoices';
import type { Product } from "@/types/product";
import type { Supplier } from "@/types/supplier";
import { PurchaseInvoiceForm } from '../../components/purchase-invoice/purchase-invoice-form';

type SupplierSelect = Pick<Supplier, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface CreatePurchaseInvoiceProps {
    suppliers: SupplierSelect[];
    products: ProductSelect[];
}

export default function CreatePurchaseInvoice({
    suppliers,
    products
}: CreatePurchaseInvoiceProps) {
    return (
        <>
            <Head title="New Purchase Invoice" />

            <div className="mt-3 mb-8 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Fill in the details to create a new purchase invoice"
                />

                <div className="max-w-5xl">
                    <PurchaseInvoiceForm
                        suppliers={suppliers}
                        products={products}
                    />
                </div>
            </div>
        </>
    );
}

CreatePurchaseInvoice.layout = {
    breadcrumbs: [
        {
            title: 'Purchase Invoices',
            href: purchaseInvoicesIndex().url,
        },
        {
            title: 'New',
        },
    ],
};
