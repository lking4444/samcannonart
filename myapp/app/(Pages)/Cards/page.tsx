import SearchFilter from "../Components/SearchFilter";
import ItemTile from "../Components/ItemTile";

import styles from './Cards.module.css'
import { ItemElement } from "../Types";
import ItemList from "../Components/ItemList";


export default function CardsPage(){
    const item: ItemElement = {
        id: 1,
        name: "Test",
        type: "Card", 
        price: 10,
        imageSrc: "/Images/Art/image1.png"
      };

    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Cards</h1>
            <SearchFilter/>
            <ItemList></ItemList>
         </div>
}