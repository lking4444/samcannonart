import { prisma } from '@/lib/prisma';
import { ItemType } from '@prisma/client';

type CreateOriginalsInput = {
    name: string;
    uploadId: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    tags: string[];
    description?: string;
    year?: number;
  };

export async function createOriginal(data: CreateOriginalsInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        uploadId: data.uploadId,
        type: ItemType.ORIGINAL,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        tags: data.tags,
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

export async function createOriginals(data: CreateOriginalsInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            uploadId: item.uploadId,
            type: ItemType.ORIGINAL,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            tags: item.tags,
            description: item.description,
            year: item.year,
            original: {
              create: {},
            },
          },
          include: {
            original: true,
          },
        })
      )
    );
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