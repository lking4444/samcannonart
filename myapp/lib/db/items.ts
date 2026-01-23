import { prisma } from '@/lib/prisma';

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


export async function getItem(id: Number){
    return prisma.item.findUnique({
        where: {id: Number(id)},
    });
}