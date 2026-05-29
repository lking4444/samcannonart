"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./FeatureSection.module.css";

type Side = "left" | "right";

type FeatureSectionProps = {
  title: string;
  description: string;
  images: [string, string, string];
  href: string;
  side?: Side;
};

export default function FeatureSection({ title, description, images, href, side = "left", }: FeatureSectionProps) {
  const isRight = side === "right";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        ${styles.section}
        ${!isRight ? styles.leftSection : styles.rightSection}
        ${isRight ? styles.slideFromRight : styles.slideFromLeft}
        ${isVisible ? styles.visible : ""}
      `}
    >
      <div
        className={`${styles.sectionContentContainer} ${
          isRight ? styles.sectionContentRight : ""
        }`}
      >
        <div
          className={`${styles.sectionInfoContainer} ${
            isRight ? styles.sectionInfoRight : ""
          }`}
        >
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.text}>{description}</p>
          <Link href={href} className={styles.link}>
            Explore
          </Link>
        </div>

        <div className={styles.gridWrapper}>
          <div className={styles.imagesContainer}>
            <div className={styles.imageItem}>
              <Image src={images[0]} width={300} height={100} alt={`${title} artwork 1`} />
            </div>
            <div className={styles.imageItem}>
              <Image
                className={styles.picture}
                src={images[1]}
                width={300}
                height={100}
                alt={`${title} artwork 2`}
              />
            </div>
            <div className={styles.imageItem}>
              <Image src={images[2]} width={300} height={100} alt={`${title} artwork 3`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}