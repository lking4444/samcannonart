import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateSlatesInput = {
    name: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
  };

export async function createSlate(data: CreateSlatesInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.SLATE,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        slate: {
            create: {},
        },
        },
        include: {
        slate: true,
        },
    });
}

export async function createSlates(data: CreateSlatesInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            type: ItemType.SLATE,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            slate: {
              create: {},
            },
          },
          include: {
            slate: true,
          },
        })
      )
    );
  }

export async function deleteSlateByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllSlates(){
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