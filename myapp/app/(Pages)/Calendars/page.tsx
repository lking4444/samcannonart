import styles from '../pages.module.css'
import ItemList from "../Components/ItemList";
import type { Item } from '@/app/generated/prisma/client';
import { ItemClient } from '../Types';
import { getAllCalendarItems } from "@/lib/db/items";


export default async function CalendarsPage(){
    const items : Item[] = await getAllCalendarItems();
    
    if (!items){
        return(<p>No Items</p>)
    }

    const clientItems : ItemClient[] = items.map((item) => ({
        ...item,
        price: item.price.toString(),
      }));

    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Calendars</h1>
            <ItemList items={clientItems}></ItemList>
         </div>
}