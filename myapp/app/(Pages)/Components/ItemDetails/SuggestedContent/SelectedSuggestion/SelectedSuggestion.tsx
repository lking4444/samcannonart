import { ItemElement } from "@/app/(Pages)/Types"

import styles from './SelectedSuggestion.module.css'
import Image from "next/image";

type SelectedSuggestionProps = {
    item : ItemElement
}

export default function SelectedSuggestion({item} : SelectedSuggestionProps){

    return(
        <div>
            <div className={styles.suggestedContentBackground}>
                <Image  className={styles.selectedImage}src={item.imageSrc} width={200} height={200} alt={"image"}/>
                <div className={styles.overlayBackground}></div>
                <div className={styles.overlayText}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p>£{item.price}</p>
                </div>
            </div>
        </div>
    )

}