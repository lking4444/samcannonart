import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateNotepadsInput = {
    name: string;
    image: string;
    price: string;
    uploadId: string;
    stock: number;
    dimensions?: string;
    tags: string[];
    media?: string;
    description?: string;
    year?: number;
    notePadName?: string;
  };

export async function createNotepad(data: CreateNotepadsInput) {
    console.log(data.notePadName);
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.NOTEPAD,
        image: data.image,
        uploadId: data.uploadId,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        tags: data.tags,
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

export async function createNotepads(data: CreateNotepadsInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            type: ItemType.NOTEPAD,
            uploadId: item.uploadId,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            notePad: {
              create: {
                notePadName: item.notePadName,
              },
            },
          },
          include: {
            notePad: true,
          },
        })
      )
    );
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