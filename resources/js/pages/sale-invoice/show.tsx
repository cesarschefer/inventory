import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared/page-header';
import { usePermission } from '@/hooks/use-permission';
import { index as saleInvoicesIndex } from '@/routes/sale-invoices';
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import type { SaleInvoice } from "@/types/sale-invoice";
import { SaleInvoiceForm } from '../../components/sale-invoice/sale-invoice-form';

type CustomerSelect = Pick<Customer, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface ShowSaleInvoiceProps {
    sale_invoice: SaleInvoice;
    customers: CustomerSelect[];
    products: ProductSelect[];
}

export default function ShowSaleInvoice({
    sale_invoice,
    customers,
    products
}: ShowSaleInvoiceProps) {
    const { can } = usePermission();
    const canEdit = can('edit-sales');
    const isConfirmed = Number(sale_invoice.status) !== 0;

    return (
        <>
            <Head title={`Sale Invoice ${sale_invoice.number}`} />

            <div className="mt-3 mb-8 space-y-8 px-4 sm:px-6">
                <PageHeader
                    description={isConfirmed || !canEdit ? "View sale invoice details" : "View or edit sale invoice details"}
                />

                <div className="max-w-full">
                    <SaleInvoiceForm
                        saleInvoice={sale_invoice}
                        customers={customers}
                        products={products}
                    />
                </div>
            </div>
        </>
    );
}

ShowSaleInvoice.layout = {
    breadcrumbs: [
        {
            title: 'Sale Invoices',
            href: saleInvoicesIndex().url,
        },
        {
            title: 'View',
        },
    ],
};
