"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { CarouselItem } from "../../Types";
import SelectedSuggestion from "./SelectedSuggestion";
import { ItemType } from "@prisma/client";
import { getItemImageSrc } from "@/lib/images/imagepaths";

import styles from "./PopularContent.module.css";
import Loading from "../../Components/Loading";
import ErrorState from "@/app/Components/Error";

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

  const [isVisible, setIsVisible] = useState(false);
  const [hasIntroFinished, setHasIntroFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPopularItems() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/items/popular/?limit=5");

        if (!response.ok) {
          throw new Error("Failed to fetch popular items");
        }

        const data: PopularItem[] = await response.json();

        const mappedItems: CarouselItem[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          type: item.type,
          price: item.price,
          description: item.description,
        }));

        if (!cancelled) {
          setItems(mappedItems);
          setOrder(mappedItems.map((_, index) => index));
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchPopularItems();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading || hasError || items.length < 5) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntroFinished(false);
          setIsVisible(true);
          observer.unobserve(container);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [isLoading, hasError, items.length]);

  const imageSrcs = useMemo(() => {
    return items.map((item) => getItemImageSrc(item.type, item.image, true));
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  if (hasError || items.length < 5) {
    return (
      <div className={styles.container}>
        <ErrorState />
      </div>
    );
  }

  const leftOuter = items[order[0]];
  const leftInner = items[order[1]];
  const center = items[order[2]];
  const rightInner = items[order[3]];
  const rightOuter = items[order[4]];

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={`
          ${styles.introMotion}
          ${isVisible ? styles.visible : ""}
          ${hasIntroFinished ? styles.introFinished : ""}
        `}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform") {
            setHasIntroFinished(true);
          }
        }}
      >
        <div className={styles.suggestContentContainer}>
          <span className={styles.carouselItemContainer}>
            <img
              key={`left-outer-${leftOuter.id}`}
              src={imageSrcs[order[0]]}
              width={75}
              height={75}
              className={`${styles.outerImage} ${styles.leftOuterImage}`}
              alt={leftOuter.name}
            />

            <img
              key={`left-inner-${leftInner.id}`}
              src={imageSrcs[order[1]]}
              width={75}
              height={75}
              className={`${styles.innerImage} ${styles.leftInnerImage}`}
              alt={leftInner.name}
            />

            <div className={styles.selectedWrapper}>
              <button
                type="button"
                onClick={shiftLeft}
                className={styles.carouselButtonLeft}
                aria-label="Previous popular item"
              >
                <Image
                  src="/api/images/Icons/chevron-left.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles.carouselChevron}
                />
              </button>

              <SelectedSuggestion item={center} />

              <button
                type="button"
                onClick={shiftRight}
                className={styles.carouselButtonRight}
                aria-label="Next popular item"
              >
                <Image
                  src="/api/images/Icons/chevron-right.svg"
                  alt=""
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
              className={`${styles.innerImage} ${styles.rightInnerImage}`}
              alt={rightInner.name}
            />

            <img
              key={`right-outer-${rightOuter.id}`}
              src={imageSrcs[order[4]]}
              width={75}
              height={75}
              className={`${styles.outerImage} ${styles.rightOuterImage}`}
              alt={rightOuter.name}
            />
          </span>
        </div>
      </div>
    </div>
  );
}