import { ItemClient, ItemElement} from "../../Types"
import type { Item } from '@/app/generated/prisma/client';
import Link from 'next/link';

import styles from './ItemTile.module.css'
import { getImageKey } from "@/lib/imagepaths";


type ItemTileProps = {
    item: ItemClient
}

export default function ItemTile({item} : ItemTileProps){

    const stringPrice: string = "£" + String(item.price);

    const imagePath = getImageKey(item.type, item.image);

    console.log(imagePath)


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