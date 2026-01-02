import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateOriginalsInput = {
    name: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
  };

export async function createOriginal(data: CreateOriginalsInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.ORIGINAL,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        original: {
            create: {},
        },
        },
        include: {
        original: true,
        },
    });
}

export async function deleteOriginalByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllOriginals(){
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