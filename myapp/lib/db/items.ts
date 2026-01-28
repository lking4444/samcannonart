import { prisma } from '@/lib/prisma';
import type { Item } from '@/app/generated/prisma/client';

export async function getAllCardItems(){
    return prisma.item.findMany({
        where: {type: 'CARD'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllCalendarItems(){
    return prisma.item.findMany({
        where: {type: 'CALENDAR'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllOriginalItems(){
    return prisma.item.findMany({
        where: {type: 'ORIGINAL'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllGiftItems(){
    return prisma.item.findMany({
        where: {type: 'GIFT'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllSlateItems(){
    return prisma.item.findMany({
        where: {type: 'SLATE'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllPrintItems(){
    return prisma.item.findMany({
        where: {type: 'PRINT'},
        orderBy: {year: 'desc'},
    });
}


export async function getAllNotepadItems(){
    return prisma.item.findMany({
        where: {type: 'NOTEPAD'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllItemsById(ids: number[]) {
    return prisma.item.findMany({
      where: {
        id: { in: ids },
      },
    })
}


export async function getItem(id: number){
    return prisma.item.findUnique({
        where: {id},
    });
}



export async function changeStock(changeValue : number, id : number){
    const item: Item | null = await prisma.item.findUnique({
        where: { id },
    });
}

export async function decrementStock(amount : number, id : number){
    return prisma.item.update({
        where: {id},
        data: {
            stock: {
                decrement: amount,
            },
        },
    });
}

export async function incrementStock(amount : number, id : number){
    return prisma.item.update({
        where: {id},
        data: {
            stock: {
                increment: amount,
            },
        },
    });
}