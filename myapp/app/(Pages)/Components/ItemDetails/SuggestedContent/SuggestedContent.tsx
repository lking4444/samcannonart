'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import SelectedSuggestion from "./SelectedSuggestion";
import Loading from "../../Loading";
import { ItemClient } from "../../../Types";

import styles from './SuggestedContent.module.css'
import { getItemImageSrc } from "@/lib/imagepaths";
import { getSuggestedContent } from "@/lib/items";

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

        (async () => {
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
            if (!cancelled) setLoading(false);
        }
        })();

        return () => {
        cancelled = true;
        };
    }, [id]);

    const shiftLeft = () => {
        setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    };

    const shiftRight = () => {
        setOrder((prev) => [...prev.slice(1), prev[0]]);
    };

    if (loading) return <Loading />;
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
        <div className={styles.suggestContentContainer}>
            <span className={styles.carouselItemContainer}>
            <img
                src={getItemImageSrc(leftOuter.type, leftOuter.image)}
                width={75}
                height={75}
                className={styles.outerImage}
                alt={leftOuter.name}
            />

            <img
                src={getItemImageSrc(leftInner.type, leftInner.image)}
                width={75}
                height={75}
                className={styles.innerImage}
                alt={leftInner.name}
            />

            <div className={styles.selectedWrapper}>
                <button onClick={shiftLeft} className={styles.carouselButtonLeft}>
                <Image
                    src="/icons/chevron-left.svg"
                    alt="Previous suggestion"
                    width={24}
                    height={24}
                    className={styles.carouselChevron}
                />
                </button>

                <Link href={`/Item/${center.id}`}>
                <SelectedSuggestion item={center} />
                </Link>

                <button onClick={shiftRight} className={styles.carouselButtonRight}>
                <Image
                    src="/icons/chevron-right.svg"
                    alt="Next suggestion"
                    width={24}
                    height={24}
                    className={styles.carouselChevron}
                />
                </button>
            </div>

            <img
                src={getItemImageSrc(rightInner.type, rightInner.image)}
                width={75}
                height={75}
                className={styles.innerImage}
                alt={rightInner.name}
            />

            <img
                src={getItemImageSrc(rightOuter.type, rightOuter.image)}
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