import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared/page-header';
import { index as saleInvoicesIndex } from '@/routes/sale-invoices';
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import { SaleInvoiceForm } from '../../components/sale-invoice/sale-invoice-form';

type CustomerSelect = Pick<Customer, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface CreateSaleInvoiceProps {
    customers: CustomerSelect[];
    products: ProductSelect[];
}

export default function CreateSaleInvoice({
    customers,
    products
}: CreateSaleInvoiceProps) {
    return (
        <>
            <Head title="New Sale Invoice" />

            <div className="mt-3 mb-8 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description="Fill in the details to create a new sale invoice"
                />

                <div className="max-w-full">
                    <SaleInvoiceForm
                        customers={customers}
                        products={products}
                    />
                </div>
            </div>
        </>
    );
}

CreateSaleInvoice.layout = {
    breadcrumbs: [
        {
            title: 'Sale Invoices',
            href: saleInvoicesIndex().url,
        },
        {
            title: 'New',
        },
    ],
};
