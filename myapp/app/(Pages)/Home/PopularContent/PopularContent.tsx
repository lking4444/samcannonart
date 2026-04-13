"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SelectedSuggestion from "./SelectedSuggestion";
import styles from "./PopularContent.module.css";
import { ItemType } from "@/app/generated/prisma/enums";
import { getItemImageSrc } from "@/lib/imagepaths";
import { CarouselItem } from "../../Types";

type PopularItem = {
  id: number;
  name: string;
  type: ItemType;
  image: string;
  price: string;
  description?: string | null;
  popular: boolean;
};

export default function PopularContent() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchPopularItems() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/items/popular/?limit=5");

        if (!response.ok) {
          throw new Error("Failed to fetch popular items");
        }

        const data: PopularItem[] = await response.json();

        console.log(data);

        const mappedItems: CarouselItem[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          type: item.type,
          price: item.price,
          description: item.description,
        }));

        setItems(mappedItems);
        setOrder(mappedItems.map((_, index) => index));
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularItems();
  }, []);

  const shiftLeft = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  const shiftRight = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
  };

  if (isLoading) {
    return <div className={styles.container}>Loading popular items...</div>;
  }

  if (hasError || items.length < 5) {
    return <div className={styles.container}>Could not load popular items.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.suggestContentContainer}>
        <span className={styles.carouselItemContainer}>
          <img
            src={getItemImageSrc(items[order[0]].type, items[order[0]].image)}
            width={75}
            height={75}
            className={styles.outerImage}
            alt={items[order[0]].name}
          />

          <img
            src={getItemImageSrc(items[order[1]].type, items[order[1]].image)}
            width={75}
            height={75}
            className={styles.innerImage}
            alt={items[order[1]].name}
          />

          <div className={styles.selectedWrapper}>
            <button onClick={shiftLeft} className={styles.carouselButtonLeft}>
              <Image
                src="/icons/chevron-left.svg"
                alt="Left"
                width={24}
                height={24}
                className={styles.carouselChevron}
              />
            </button>

            <SelectedSuggestion item={items[order[2]]} />

            <button onClick={shiftRight} className={styles.carouselButtonRight}>
              <Image
                src="/icons/chevron-right.svg"
                alt="Right"
                width={24}
                height={24}
                className={styles.carouselChevron}
              />
            </button>
          </div>

          <img
            src={getItemImageSrc(items[order[3]].type, items[order[3]].image)}
            width={75}
            height={75}
            className={styles.innerImage}
            alt={items[order[3]].name}
          />

          <img
            src={getItemImageSrc(items[order[4]].type, items[order[4]].image)}
            width={75}
            height={75}
            className={styles.outerImage}
            alt={items[order[4]].name}
          />
        </span>
      </div>
    </div>
  );
}