export type PurchaseInvoiceItem = {
    product_id: number | string;
    product_name?: string;
    quantity: number | string;
    unit_price: number | string;
    subtotal: number;
};