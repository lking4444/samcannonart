import { prisma } from '@/lib/prisma';
import { ItemType, GiftType } from '@/app/generated/prisma/enums';

type CreateGiftInput = {
    name: string;
    image: string;
    price: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
    giftNumber: string;
    giftType: GiftType;
  };

export async function createGift(data: CreateGiftInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        type: ItemType.GIFT,
        image: data.image,
        price: data.price,
        stock: data.stock,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        gift: {
            create: {
            giftNumber: data.giftNumber,
            giftType: data.giftType
            },
        },
        },
        include: {
        gift: true,
        },
    });
}

export async function createGifts(data: CreateGiftInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            type: ItemType.GIFT,
            image: item.image,
            price: item.price,
            stock: item.stock,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            gift: {
              create: {
                giftNumber: item.giftNumber,
                giftType: item.giftType
              },
            },
          },
          include: {
            gift: true,
          },
        })
      )
    );
  }

export async function deleteGiftByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}

export async function getAllGifts(){
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