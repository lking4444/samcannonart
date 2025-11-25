import { ItemElement } from '../../Types';
import AddToBasket from './AddToBasket';
import BuyNow from './BuyNow';
import styles from './ItemDetails.module.css'
import SuggestedContent from './SuggestedContent';
import Image from "next/image";


export default function ItemDetails(){

    /* Await item details here */

    const itemName : string = "Pretty Flowers";
    const itemCost : string = "£20";
    const itemMaterialDescription : string = "Water Colours on Water Colour paper";
    const itemSize: string = "25x25";

    const item: ItemElement = {
        id: 1,
        name: "Test",
        type: "Card", 
        price: 10,
        imageSrc: "/Images/Art/image7.png"
      };

    return (
        <span className={styles.pageContentContainer}>
            <div className={styles.itemComponentContainer}>
                <span className={styles.alternateImageContainer}>
                    <Image src={item.imageSrc} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                    <Image src={item.imageSrc} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                    <Image src={item.imageSrc} width={75} height={75} alt={"image"} className={styles.sideImage}/>
                </span>
                <Image src={item.imageSrc} width={400} height={400} alt={"image"}/>
                <span className={styles.descriptionContainer}>
                    <h1 className={styles.itemName}>{item.name}</h1>
                    <p className={styles.itemPrice}>£{item.price}</p>
                    <hr className={styles.divider} />
                    <p className={styles.itemDescription}>{itemMaterialDescription}</p>
                    <p className={styles.itemSize}>{itemSize}cm</p>
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