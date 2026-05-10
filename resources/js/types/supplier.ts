export type Supplier = {
    id: number;
    name: string;
    tax_id: string | null;
    email: string;
    phone: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    created_by: number;
};