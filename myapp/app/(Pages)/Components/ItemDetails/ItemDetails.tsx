import { ItemElement } from '../../Types';
import AddToBasket from './AddToBasket';
import BuyNow from './BuyNow';
import styles from './ItemDetails.module.css'
import SuggestedContent from './SuggestedContent';
import Image from "next/image";
import type { Item } from '@/app/generated/prisma/client';


type ItemDetailsProps = {
    item: Item
}

export default async function ItemDetails({item} : ItemDetailsProps){

    /* Await item details here */

    const itemName : string = "Pretty Flowers";
    const itemCost : string = "£20";
    const itemMaterialDescription : string = "Water Colours on Water Colour paper";
    const itemSize: string = "25x25";

    return (
        <span className={styles.pageContentContainer}>
            <div className={styles.itemComponentContainer}>
                <span className={styles.alternateImageContainer}>
                    <Image src={item.image} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                    <Image src={item.image} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                    <Image src={item.image} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                </span>
                <Image src={item.image} width={400} height={400} alt={"image"}/>
                <span className={styles.descriptionContainer}>
                    <h1 className={styles.itemName}>{item.name}</h1>
                        <p className={styles.itemPrice}>£{String(item.price)}</p>
                        <hr className={styles.divider} />
                        <p className={styles.itemDescription}>{item.description}</p>
                        <p className={styles.itemSize}>{item.dimensions}cm</p>
                        <hr className={styles.divider} />
                    <div className={styles.purchaseButtons}>
                        <BuyNow/>
                        <AddToBasket/>
                    </div>
                </span>
            </div>  
            <SuggestedContent/>
        </span>
        
    )
}