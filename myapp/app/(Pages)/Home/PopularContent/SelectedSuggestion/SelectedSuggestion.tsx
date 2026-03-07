import { ItemElement } from "@/app/(Pages)/Types"

import styles from './SelectedSuggestion.module.css'
import Image from "next/image";
import Link from "next/link";

type SelectedSuggestionProps = {
    item : ItemElement
}

export default function SelectedSuggestion({item} : SelectedSuggestionProps){

    return(
        <div>
            <div className={styles.suggestedContentBackground}>
                <Link href={`/Item/${item.id}`} >
                    <Image  className={styles.selectedImage}src={item.imageSrc} key={item.imageSrc} width={100} height={200} alt={"image"}/>
                </Link>
                <div className={styles.overlayBackground}></div>
                <div className={styles.overlayText}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p>£{item.price}</p>
                </div>
            </div>
        </div>
    )

}