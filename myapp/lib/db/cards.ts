import { prisma } from '@/lib/prisma';
import { ItemType } from '@/app/generated/prisma/enums';

type CreateCardInput = {
    name: string;
    image: string;
    uploadId: number;
    price: string;
    stock: number;
    tags: string[];
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
    cardId: string; 
  };

export async function createCard(data: CreateCardInput) {
    return prisma.item.create({
        data: {
        name: data.name,
        uploadId: data.uploadId,
        type: ItemType.CARD,
        image: data.image,
        price: data.price,
        stock: data.stock,
        tags: data.tags,
        dimensions: data.dimensions,
        media: data.media,
        description: data.description,
        year: data.year,
        card: {
            create: {
            cardId: data.cardId,
            },
        },
        },
        include: {
        card: true,
        },
    });
}

export async function createCards(data: CreateCardInput[]) {
    return prisma.$transaction(
      data.map((item) =>
        prisma.item.create({
          data: {
            name: item.name,
            uploadId: item.uploadId,
            type: ItemType.CARD,
            image: item.image,
            price: item.price,
            stock: item.stock,
            tags: item.tags,
            dimensions: item.dimensions,
            media: item.media,
            description: item.description,
            year: item.year,
            card: {
              create: {
                cardId: item.cardId,
              },
            },
          },
          include: {
            card: true,
          },
        })
      )
    );
}

export async function deleteCardByItemId(itemId: number) {
    return prisma.item.delete({
      where: { id: itemId },
    });
}
  
export async function deleteCardByCardId(cardId: string) {
    const card = await prisma.card.findUnique({
        where: { cardId },
        select: { itemId: true },
    });

    if (!card) throw new Error('Card not found');

    return prisma.item.delete({
        where: { id: card.itemId },
    });
}

export async function getAllCards(){
    return prisma.card.findMany({
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