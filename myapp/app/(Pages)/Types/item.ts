import { ItemType } from "@/app/generated/prisma/enums";

export type Item = "Card" | "Calendar" | "Print" | "Original" | "Gift"

export type ItemElement = {
    type: Item;
    name: string;
    price: number;
    id: number; 
    imageSrc: string;
}

export type CarouselItem = {
    id: number;
    name: string;
    type: ItemType;
    image: string;
    price: string;
    description?: string | null;
  };

export type ItemClient = {
    id: number;
    name: string;
    type: ItemType;
    price: string;
    image: string;
    stock: number;
    tags: string[];
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
    popular: boolean;
    hidden: boolean;
  };