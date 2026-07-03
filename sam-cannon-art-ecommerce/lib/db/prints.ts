import { prisma } from '@/lib/prisma';
import { ItemType } from '@prisma/client';

type CreatePrintInput = {
    name: string;
    image: string;
    uploadId: string;
    price: string;
    stock: number;
    dimensions?: string;
    tags?: string[];
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
        uploadId: data.uploadId,
        stock: data.stock,
        tags: data.tags,
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
            uploadId: item.uploadId,
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