import type { Permission } from "./permission";

export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};