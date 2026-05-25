'use client'

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import SelectedSuggestion from "./SelectedSuggestion";
import Loading from "../../Loading";
import { getItemImageSrc } from "@/lib/images/imagepaths";
import { getSuggestedContent } from "@/lib/contentRecommendation/items";
import { ItemClient } from "@/app/Types/items";

import styles from './SuggestedContent.module.css'

type SuggestedContentProps = {
  id: string;
};

export default function SuggestedContent({ id }: SuggestedContentProps) {
    const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4]);
    const [items, setItems] = useState<ItemClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSuggestions() {
            try {
                setLoading(true);
                setError(null);

                const next = await getSuggestedContent(id);

                if (!cancelled) {
                setItems(next);
                setOrder([0, 1, 2, 3, 4]);
                }
            } catch (e) {
                if (!cancelled) {
                setError(e instanceof Error ? e.message : "Failed to load suggestions");
                }
            } finally {
                if (!cancelled) {
                setLoading(false);
                }
            }
        }

        loadSuggestions();

        return () => {
            cancelled = true;
            };
        }, [id]);

  const imageSrcs = useMemo(() => {
    return items.map((item) => getItemImageSrc(item.type, item.image));
  }, [items]);

  useEffect(() => {
    imageSrcs.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, [imageSrcs]);

  const shiftLeft = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  const shiftRight = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    );
  }

  if (error) return <p>Error</p>;

  if (items.length < 5) {
    return <p>Not enough suggestions available.</p>;
  }

  const leftOuter = items[order[0]];
  const leftInner = items[order[1]];
  const center = items[order[2]];
  const rightInner = items[order[3]];
  const rightOuter = items[order[4]];

  return (
    <div className={styles.container}>
      <p className={styles.recommendedTitle}>Recommended Artwork</p>

      <div className={styles.suggestContentContainer}>
        <span className={styles.carouselItemContainer}>
            <img
            key={`left-outer-${leftOuter.id}`}
            src={imageSrcs[order[0]]}
            width={75}
            height={75}
            className={styles.outerImage}
            alt={leftOuter.name}
            />

            <img
            key={`left-inner-${leftInner.id}`}
            src={imageSrcs[order[1]]}
            width={75}
            height={75}
            className={styles.innerImage}
            alt={leftInner.name}
            />

            <div className={styles.selectedWrapper}>
                <button onClick={shiftLeft} className={styles.carouselButtonLeft}>
                <Image
                    src="/api/images/Icons/chevron-left.svg"
                    alt="Previous suggestion"
                    width={24}
                    height={24}
                    className={styles.carouselChevron}
                />
                </button>

                <Link href={`/Item/${center.id}`} prefetch={false}>
                <SelectedSuggestion item={center} />
                </Link>

                <button onClick={shiftRight} className={styles.carouselButtonRight}>
                <Image
                    src="/api/images/Icons/chevron-right.svg"
                    alt="Next suggestion"
                    width={24}
                    height={24}
                    className={styles.carouselChevron}
                />
                </button>
            </div>

            <img
            key={`right-inner-${rightInner.id}`}
            src={imageSrcs[order[3]]}
            width={75}
            height={75}
            className={styles.innerImage}
            alt={rightInner.name}
            />

            <img
            key={`right-outer-${rightOuter.id}`}
            src={imageSrcs[order[4]]}
            width={75}
            height={75}
            className={styles.outerImage}
            alt={rightOuter.name}
            />
            </span>
        </div>
    </div>
  );
}