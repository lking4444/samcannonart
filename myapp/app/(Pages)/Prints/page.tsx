import styles from '../pages.module.css'
import ItemList from "../Components/ItemList";
import { getAllPrintItems } from "@/lib/db/items";
import type { Item } from '@/app/generated/prisma/client';
import { ItemClient } from '../Types';


export default async function PrintsPage(){
    const items : Item[] = await getAllPrintItems();
    
    if (!items){
        return(<p>No Items</p>)
    }

    const clientItems : ItemClient[] = items.map((item) => ({
        ...item,
        price: item.price.toString(),
      }));

    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Prints</h1>
            <ItemList items={clientItems}></ItemList>
         </div>
}