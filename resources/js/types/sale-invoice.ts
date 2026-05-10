import type { SaleInvoiceItem } from "./sale-invoice-item";

export type SaleInvoice = {
    id: number;
    customer: {
        id: number;
        name: string;
    };
    number: string;
    date: string;
    formatted_date: string;
    total: number;
    status: number | string;
    items: SaleInvoiceItem[];
    created_at?: string;
    updated_at?: string;
};