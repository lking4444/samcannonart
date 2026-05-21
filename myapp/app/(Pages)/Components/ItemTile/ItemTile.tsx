'use client'
import Link from 'next/link';
import { useState } from 'react';

import { getImageKey } from "@/lib/images/imagepaths";
import Loading from '../Loading';
import { ItemClient } from '@/app/Types/items';

import styles from './ItemTile.module.css'

type ItemTileProps = {
    item: ItemClient
}

export default function ItemTile({item} : ItemTileProps){
    
    const [imageLoaded, setImageLoaded] = useState(false);
    const imagePath = getImageKey(item.type, item.image);
    
    return (
        <Link href={`/Item/${item.id}`} className={styles.link}>
            <span className={styles.itemContainer}>
            <span className={styles.imageWrapper}>
                {!imageLoaded && (
                    <span className={styles.imageLoading}>
                        <span className={styles.loadingInner}>
                            <Loading />
                        </span>
                    </span>
                )}

                <img
                    className={styles.image}
                    src={`/api/images/${imagePath}`}
                    width={300}
                    alt={item.name}
                    onLoad={() => setImageLoaded(true)}
                    style={{
                        opacity: imageLoaded ? 1 : 0,
                    }}
                />
            </span>
                <span className={styles.namePriceContainer}>
                    <p className={styles.nameContainer}>{item.name} {item.dimensions}</p>
                    <p className={styles.itemPrice}>£{Number(item.price).toFixed(2)}</p>
                </span>
            </span>
        </Link>
    )
}