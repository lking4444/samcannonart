'use client'

import { ItemElement } from '../../Types';
import AddToBasket from './AddToBasket';
import BuyNow from './BuyNow';
import styles from './ItemDetails.module.css'
import SuggestedContent from './SuggestedContent';
import Image from "next/image";
import type { Item, ItemType } from '@/app/generated/prisma/client';
import { getImageKey } from '@/lib/imagepaths';

export type clientItem ={
    name: string;
    id: number;
    type: ItemType;
    price: number;
    image: string;
    stock: number;
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
}

type ItemDetailsProps = {
    item: clientItem
}

export default function ItemDetails({item} : ItemDetailsProps){

    const imagePath = getImageKey(item.type, item.image);

    return (
        <span className={styles.pageContentContainer}>
            <div className={styles.itemComponentContainer}>
                <Image src={`/api/images/${imagePath}`} width={400} height={400} alt={"image"}/>
                <span className={styles.descriptionContainer}>
                    <h1 className={styles.itemName}>{item.name}</h1>
                        <p className={styles.itemPrice}>£{String(item.price)}</p>
                        <hr className={styles.divider} />
                        <p className={styles.itemDescription}>{item.description}</p>
                        <p className={styles.itemSize}>{item.dimensions}cm</p>
                        <hr className={styles.divider} />
                    <div className={styles.purchaseButtons}>
                        <BuyNow item={item}/>
                        <AddToBasket itemId={item.id}/>
                    </div>
                </span>
            </div>  
            <SuggestedContent id={String(item.id)}/>
        </span>
        
    )
}