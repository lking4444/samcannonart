import Image from "next/image";
import Link from "next/link";

import { CarouselItem } from "@/app/(Pages)/Types";
import { getItemImageSrc } from "@/lib/images/imagepaths";

import styles from "./SelectedSuggestion.module.css";

type SelectedSuggestionProps = {
  item: CarouselItem;
};

export default function SelectedSuggestion({ item }: SelectedSuggestionProps) {
  return (
    <div className={styles.suggestedContentBackground}>
      <Link href={`/Item/${item.id}`} className={styles.imageLink}>
        <Image
          className={styles.selectedImage}
          src={getItemImageSrc(item.type, item.image)}
          width={250}
          height={300}
          alt={item.name}
          priority={false}
        />
      </Link>

      <div className={styles.overlayBackground} />

      <div className={styles.overlayText}>
        <p className={styles.itemName}>{item.name}</p>
        <p>£{Number(item.price).toFixed(2)}</p>
      </div>
    </div>
  );
}