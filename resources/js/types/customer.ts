export type Customer = {
    id: number;
    name: string;
    tax_id: string | null;
    email: string;
    phone: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    floor: string | null;
    apartment: string | null;
    customer_type: number;
    created_by: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};