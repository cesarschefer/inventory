export type StockMovement = {
    id: number;
    product?: {
        id: number;
        name: string;
    };
    type: number | string;
    quantity: number;
    document_type?: string; // 'purchase' | 'sale'
    document?: {
        id: number;
        name: string;
    };
    formatted_date?: string;
    created_at?: string;
    updated_at?: string;
};