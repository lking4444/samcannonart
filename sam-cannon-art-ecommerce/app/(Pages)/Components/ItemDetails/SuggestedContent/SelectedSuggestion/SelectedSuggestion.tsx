import Image from "next/image";

import { getItemImageSrc } from "@/lib/images/imagepaths";
import { ItemClient } from "@/app/Types/items";

import styles from './SelectedSuggestion.module.css'

type SelectedSuggestionProps = {
    item : ItemClient
}

export default function SelectedSuggestion({item} : SelectedSuggestionProps){

    return(
        <div>
            <div className={styles.suggestedContentBackground}>
                <Image  className={styles.selectedImage}src={getItemImageSrc(item.type, item.image, true)} key={item.image} width={200} quality={40} height={200} alt={"image"}/>
                <div className={styles.overlayBackground}></div>
                <div className={styles.overlayText}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p>£{Number(item.price).toFixed(2)} - {item.type.toLowerCase()}</p>
                </div>
            </div>
        </div>
    )

}