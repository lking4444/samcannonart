import SearchFilter from "../Components/SearchFilter";
import ItemTile from "../Components/ItemTile";

import styles from './Cards.module.css'

export default function CardsPage(){
    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Cards</h1>
            <SearchFilter/>
            <ItemTile/>
         </div>
}