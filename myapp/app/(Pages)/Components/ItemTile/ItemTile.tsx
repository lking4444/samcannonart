import { ItemElement} from "../../Types"

import styles from './ItemTile.module.css'

type ItemTileProps = {
    item: ItemElement
}

export default function ItemTile({item} : ItemTileProps){

    const stringPrice: string = "£" + String(item.price);

    return (
        <span className={styles.itemContainer}>
            <div className={styles.placeholderBox}></div>
            <span className={styles.namePriceContainer}>
                <text className={styles.nameContainer}>{item.name} 32x32</text>
                <text className={styles.priceText}>{stringPrice}</text>
            </span>
        </span>
    )
}