import type { PurchaseInvoiceItem } from "./purchase-invoice-item";

export type PurchaseInvoice = {
    id: number;
    supplier: {
        id: number;
        name: string;
    };
    number: string;
    date: string;
    formatted_date: string;
    total: number;
    status: number | string;
    items: PurchaseInvoiceItem[];
    created_at?: string;
    updated_at?: string;
};