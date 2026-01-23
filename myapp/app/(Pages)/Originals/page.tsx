import styles from '../pages.module.css'
import ItemList from "../Components/ItemList";
import { getAllOriginalItems } from "@/lib/db/items";
import type { Item } from '@/app/generated/prisma/client';
import { ItemClient } from '../Types';


export default async function OriginalsPage(){
    const items : Item[] = await getAllOriginalItems();
    
    if (!items){
        return(<p>No Items</p>)
    }

    const clientItems : ItemClient[] = items.map((item) => ({
        ...item,
        price: item.price.toString(),
      }));

    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Originals</h1>
            <ItemList items={clientItems}></ItemList>
         </div>
}