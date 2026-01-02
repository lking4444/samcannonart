import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateNotepadsInput = {
    name: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
    notePadName: string;
  };

export async function createNotepad(data: CreateNotepadsInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.NOTEPAD,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        notePad: {
            create: {
            notePadName: data.notePadName,
            },
        },
        },
        include: {
        notePad: true,
        },
    });
}

export async function deleteNotepadByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllNotepads(){
    return prisma.calendar.findMany({
        include: {
            item: true
        },
        orderBy:{
            item: {
                year: 'desc',
            },
        },
    });
}