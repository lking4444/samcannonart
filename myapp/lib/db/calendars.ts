import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateCalendarInput = {
    name: string;
    image: string;
    price: string;
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