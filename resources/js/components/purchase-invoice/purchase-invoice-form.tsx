import { useForm } from "@inertiajs/react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PurchaseInvoiceHeader } from "@/components/purchase-invoice/purchase-invoice-header";
import { PurchaseInvoiceItems } from "@/components/purchase-invoice/purchase-invoice-items";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-permission";
import { store, update } from "@/routes/purchase-invoices";
import type { Product } from "@/types/product";
import type { PurchaseInvoice } from "@/types/purchase-invoice";
import type { PurchaseInvoiceItem } from "@/types/purchase-invoice-item";
import type { Supplier } from "@/types/supplier";

type SupplierSelect = Pick<Supplier, 'id' | 'name'>
type ProductSelect = Pick<Product, 'id' | 'name'>

interface PurchaseInvoiceFormProps {
    purchaseInvoice?: PurchaseInvoice;
    suppliers: SupplierSelect[];
    products: ProductSelect[];
}

export function PurchaseInvoiceForm({
    purchaseInvoice,
    suppliers,
    products
}: PurchaseInvoiceFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        supplier_id: purchaseInvoice?.supplier?.id?.toString() || "",
        invoice_number: purchaseInvoice?.number || "",
        invoice_date: purchaseInvoice?.date || new Date().toISOString().split('T')[0],
        total: Number(purchaseInvoice?.total) || 0,
        invoiceItems: purchaseInvoice?.items?.map(item => ({
            product_id: item.product_id.toString(),
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            subtotal: Number(item.subtotal)
        })) || [{ product_id: "", quantity: 1, unit_price: 0, subtotal: 0 }]
    });

    const updateItem = (index: number, field: keyof PurchaseInvoiceItem, value: string | number) => {
        const newItems = [...data.invoiceItems];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'quantity' || field === 'unit_price') {
            const qty = Number(newItems[index].quantity) || 0;
            const price = Number(newItems[index].unit_price) || 0;
            newItems[index].subtotal = Number((qty * price).toFixed(2));
        }

        const total = newItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

        // Use functional update or object spread to ensure total is updated alongside items
        setData((prevData) => ({
            ...prevData,
            invoiceItems: newItems,
            total: Number(total.toFixed(2))
        }));
    };

    const addItem = () => {
        setData('invoiceItems', [
            ...data.invoiceItems,
            { product_id: "", quantity: 1, unit_price: 0, subtotal: 0 }
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = data.invoiceItems.filter((_, i) => i !== index);
        const total = newItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

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
                toast.success(purchaseInvoice ? 'Invoice updated successfully' : 'Invoice created successfully');
            },
            onError: (errors: Record<string, string>) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Please check the form for errors');
                }
            }
        };

        if (purchaseInvoice) {
            put(update(purchaseInvoice.id).url, options);
        } else {
            post(store().url, options);
        }
    };

    const { can } = usePermission();
    const isConfirmed = purchaseInvoice && Number(purchaseInvoice.status) !== 0;
    const canAction = purchaseInvoice ? can('edit-purchases') : can('create-purchases');
    const isFormDisabled = isConfirmed || !canAction;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <PurchaseInvoiceHeader
                data={data}
                setData={setData}
                errors={errors}
                suppliers={suppliers}
                disabled={isFormDisabled}
            />

            <PurchaseInvoiceItems
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
                        {purchaseInvoice ? 'Update Invoice' : 'Save Invoice'}
                    </Button>
                )}
            </div>
        </form>
    );
}
