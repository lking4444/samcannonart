import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreatePrintInput = {
    name: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
    printId: string; 
  };

export async function createPrint(data: CreatePrintInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.PRINT,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        print: {
            create: {
                printId: data.printId
            }
        },
        },
        include: {
        print: true,
        },
    });
}

export async function createPrints(data: CreatePrintInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            type: ItemType.PRINT,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            print: {
              create: {
                printId: item.printId,
              },
            },
          },
          include: {
            print: true,
          },
        })
      )
    );
  }

export async function deletePrintByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllPrints(){
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