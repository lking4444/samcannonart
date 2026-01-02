import ItemDetails from "../../Components/ItemDetails";
import { getItem } from "@/lib/db/items";
import { notFound } from "next/navigation";
import type { Item } from '@/app/generated/prisma/client';

export default async function ItemPage({
    params,
  }: {
    params: { id: string };
  }) {
    const { id } = await params;

    const item = await getItem(Number(id))
    
    if (!item){
        return notFound();
    }
  
    return (
        <>
            <ItemDetails item={item}></ItemDetails>
        </>    
    );
  }