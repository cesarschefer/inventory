export type SaleInvoiceItem = {
    product_id: number | string;
    product_name?: string;
    quantity: number | string;
    unit_price: number | string;
    subtotal: number;
    discount_type: number;
    discount: number;
    total: number;
};


