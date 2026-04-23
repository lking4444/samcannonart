import Link from 'next/link';

import { getImageKey } from "@/lib/imagepaths";
import { ItemClient} from "../../Types"

import styles from './ItemTile.module.css'


type ItemTileProps = {
    item: ItemClient
}

export default function ItemTile({item} : ItemTileProps){
    
    const stringPrice: string = "£" + String(item.price);
    const imagePath = getImageKey(item.type, item.image);
    
    return (
        <Link href={`/Item/${item.id}`} className={styles.link}>
            <span className={styles.itemContainer}>
                <img className={styles.image} src={`/api/images/${imagePath}`} width={300} height={300} alt={"image"}></img>
                <span className={styles.namePriceContainer}>
                    <p className={styles.nameContainer}>{item.name} {item.dimensions}</p>
                    <p className={styles.priceText}>{stringPrice}</p>
                </span>
            </span>
        </Link>
    )
}