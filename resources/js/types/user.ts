import type { Role } from "@/types/role";

export type User = {
    id: number;
    name: string;
    email: string;
    roles: Role[];
};