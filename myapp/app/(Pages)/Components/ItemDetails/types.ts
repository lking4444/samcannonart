import type { ItemType } from '@/app/generated/prisma/client';

export type ClientItem = {
    name: string;
    id: number;
    type: ItemType;
    price: number;
    image: string;
    stock: number;
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
}