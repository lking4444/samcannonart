import { ItemElement } from "@/app/(Pages)/Types"

import styles from './SelectedSuggestion.module.css'
import Image from "next/image";
import { ItemClient } from "../../../../Types";
import { getItemImageSrc } from "@/lib/imagepaths";


type SelectedSuggestionProps = {
    item : ItemClient
}

export default function SelectedSuggestion({item} : SelectedSuggestionProps){

    return(
        <div>
            <div className={styles.suggestedContentBackground}>
                <Image  className={styles.selectedImage}src={getItemImageSrc(item.type, item.image)} key={item.image} width={200} height={200} alt={"image"}/>
                <div className={styles.overlayBackground}></div>
                <div className={styles.overlayText}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p>£{item.price} - {item.type.toLowerCase()}</p>
                </div>
            </div>
        </div>
    )

}