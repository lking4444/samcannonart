import ItemDetails from "../../Components/ItemDetails";
import { getItem } from "@/lib/db/items";
import { notFound } from "next/navigation";

export default async function ItemPage({params,}: {params: Promise<{ id: string }>;}) {
    const { id } = await params;
    const numericId = Number(id);
  
    if (!Number.isInteger(numericId)) {
      return notFound();
    }
  
    const item = await getItem(numericId);
  
    if (!item) {
      return notFound();
    }
  
    const safeItem = {
      ...item,
      price: Number(item.price.toString()),
    };
  
    return (
        <>
            <ItemDetails item={safeItem}></ItemDetails>
        </>    
    );
}