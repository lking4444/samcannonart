import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateCalendarInput = {
    name: string;
    image: string;
    price: string;
    uploadId: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
  };

export async function createCalendar(data: CreateCalendarInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.CALENDAR,
        image: data.image,
        price: data.price,
        uploadId: data.uploadId,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        calendar: {
            create: {},
        },
        },
        include: {
        calendar: true,
        },
    });
}

export async function createCalendars(data: CreateCalendarInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            type: ItemType.CALENDAR,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            calendar: {
              create: {},
            },
          },
          include: {
            calendar: true,
          },
        })
      )
    );
  }

export async function deleteCalendarByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllCalendars(){
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