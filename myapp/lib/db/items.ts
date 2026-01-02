import { prisma } from '@/lib/prisma';

export async function getAllCardItems(){
    return prisma.item.findMany({
        where: {type: 'CARD'},
        orderBy: {year: 'desc'},
    });
}

export async function getItem(id: Number){
    return prisma.item.findUnique({
        where: {id: Number(id)},
    });
}