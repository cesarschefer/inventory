import { useForm } from "@inertiajs/react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SaleInvoiceHeader } from "@/components/sale-invoice/sale-invoice-header";
import { SaleInvoiceItems } from "@/components/sale-invoice/sale-invoice-items";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-permission";
import { store, update } from "@/routes/sale-invoices";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import type { SaleInvoice } from "@/types/sale-invoice";
import type { SaleInvoiceItem } from "@/types/sale-invoice-item";

type CustomerSelect = Pick<Customer, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface SaleInvoiceFormProps {
    saleInvoice?: SaleInvoice;
    customers: CustomerSelect[];
    products: ProductSelect[];
}

export function SaleInvoiceForm({
    saleInvoice,
    customers,
    products
}: SaleInvoiceFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        customer_id: saleInvoice?.customer?.id?.toString() || "",
        invoice_number: saleInvoice?.number || "",
        invoice_date: saleInvoice?.date || new Date().toISOString().split('T')[0],
        total: Number(saleInvoice?.total) || 0,
        invoiceItems: saleInvoice?.items?.map(item => ({
            product_id: item.product_id.toString(),
            quantity: Number(item.quantity) || 0,
            unit_price: Number(item.unit_price) || 0,
            subtotal: Number(item.subtotal) || 0,
            discount_type: Number(item.discount_type) || 0,
            discount: Number(item.discount) || 0,
            total: Number(item.total) || 0
        })) || [{ product_id: "", quantity: 1, unit_price: 0, subtotal: 0, discount_type: 0, discount: 0, total: 0 }]
    });

    const updateItem = (index: number, field: keyof SaleInvoiceItem, value: string | number) => {
        const newItems = [...data.invoiceItems];
        newItems[index] = { ...newItems[index], [field]: value };

        const qty = Number(newItems[index].quantity) || 0;
        const price = Number(newItems[index].unit_price) || 0;
        const subtotal = Number((qty * price).toFixed(2));
        newItems[index].subtotal = subtotal;

        const discountType = Number(newItems[index].discount_type) || 0;
        const discount = Number(newItems[index].discount) || 0;

        if (discountType === 0) {
            // Percentage discount
            newItems[index].total = Number((subtotal - (subtotal * discount / 100)).toFixed(2));
        } else {
            // Fixed discount
            newItems[index].total = Number((subtotal - discount).toFixed(2));
        }

        const total = newItems.reduce((sum, item) => sum + Number(item.total), 0);

        setData((prevData) => ({
            ...prevData,
            invoiceItems: newItems,
            total: Number(total.toFixed(2))
        }));
    };

    const addItem = () => {
        setData('invoiceItems', [
            ...data.invoiceItems,
            { product_id: "", quantity: 1, unit_price: 0, subtotal: 0, discount_type: 0, discount: 0, total: 0 }
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = data.invoiceItems.filter((_, i) => i !== index);
        const total = newItems.reduce((sum, item) => sum + Number(item.total), 0);

        setData((prevData) => ({
            ...prevData,
            invoiceItems: newItems,
            total: Number(total.toFixed(2))
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(saleInvoice ? 'Invoice updated successfully' : 'Invoice created successfully');
            },
            onError: (errors: Record<string, string>) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Please check the form for errors');
                }
            }
        };

        if (saleInvoice) {
            put(update(saleInvoice.id).url, options);
        } else {
            post(store().url, options);
        }
    };

    const { can } = usePermission();
    const isConfirmed = saleInvoice && Number(saleInvoice.status) !== 0;
    const canAction = saleInvoice ? can('edit-sales') : can('create-sales');
    const isFormDisabled = isConfirmed || !canAction;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <SaleInvoiceHeader
                data={data}
                setData={setData}
                errors={errors}
                customers={customers}
                disabled={isFormDisabled}
            />

            <SaleInvoiceItems
                items={data.invoiceItems}
                products={products}
                updateItem={updateItem}
                addItem={addItem}
                removeItem={removeItem}
                errors={errors}
                disabled={isFormDisabled}
            />

            <div className="flex justify-between items-center pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="gap-2 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                {!isFormDisabled && (
                    <Button type="submit" variant="primary" disabled={processing} className="gap-2 px-8 cursor-pointer">
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saleInvoice ? 'Update Invoice' : 'Save Invoice'}
                    </Button>
                )}
            </div>
        </form>
    );
}
