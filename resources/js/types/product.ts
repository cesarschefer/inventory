import type { Category } from "./category";

export type Product = {
    id: number;
    name: string;
    detail: string;
    sku: string;
    category: Category;
    image: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};