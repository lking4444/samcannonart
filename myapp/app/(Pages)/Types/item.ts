import { ItemType } from "@/app/generated/prisma/enums";


export type Item = "Card" | "Calendar" | "Print" | "Original" | "Gift"

export type ItemElement = {
    type: Item;
    name: string;
    price: number;
    id: number; 
    imageSrc: string;
}

export type ItemClient = {
    id: number;
    name: string;
    type: ItemType;
    price: string;
    image: string;
    stock: number;
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
  };

export const ItemExample: ItemElement[] = [
    {
        id: 1,
        name: "Birthday Card",
        type: "Card",
        price: 4.99,
        imageSrc: "/Images/Art/image1.png"
    },
    {
        id: 2,
        name: "Anniversary Gift",
        type: "Gift",
        price: 19.99,
        imageSrc: "/Images/Art/image2.png"
    },
    {
        id: 3,
        name: "Summer Calendar",
        type: "Calendar",
        price: 12.49,
        imageSrc: "/Images/Art/image3.png"
    },
    {
        id: 4,
        name: "Original Artwork",
        type: "Original",
        price: 150.0,
        imageSrc: "/Images/Art/image4.png"
    },
    {
        id: 5,
        name: "Art Print",
        type: "Print",
        price: 24.99,
        imageSrc: "/Images/Art/image5.png"
    },
    ];