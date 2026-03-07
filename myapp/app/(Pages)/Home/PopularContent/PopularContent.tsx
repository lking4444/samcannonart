"use client";

import { ItemExample } from "@/app/(Pages)/Types";
import { useState } from "react";
import Image from "next/image";
import SelectedSuggestion from "./SelectedSuggestion";

import styles from './PopularContent.module.css'



export default function PopularContent(){

    const [order, setOrder] = useState<number[]>([0,1,2,3,4]);

    const shiftLeft = () => {
        setOrder(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
      };
      
    const shiftRight = () => {
        setOrder(prev => [...prev.slice(1), prev[0]]);
    };

    return (
            <div className={styles.container}>
                <div className={styles.suggestContentContainer}>
                    <span className={styles.carouselItemContainer}>
                    <img src={ItemExample[order[0]].imageSrc} width={75} height={75} className={styles.image}></img>
                    <img src={ItemExample[order[1]].imageSrc} width={75} height={75} className={styles.image}></img>
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
                            <SelectedSuggestion item={ItemExample[order[2]]} />
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
                        <img src={ItemExample[order[3]].imageSrc} width={75} height={75} className={styles.image}></img>
                        <img src={ItemExample[order[4]].imageSrc} width={75} height={75} className={styles.image}></img>

                    </span>
                </div>
            </div>
    )
}