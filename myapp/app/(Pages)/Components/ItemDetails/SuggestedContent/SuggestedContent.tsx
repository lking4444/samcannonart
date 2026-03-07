'use client'

import { ItemExample } from "@/app/(Pages)/Types";
import { useState, useEffect } from "react";
import Image from "next/image";
import SelectedSuggestion from "./SelectedSuggestion";
import { ItemClient } from "../../../Types";


import styles from './SuggestedContent.module.css'
import Link from "next/link";
import Loading from "../../Loading";

type ApiResponse = {
    items: any[];
}



async function getSuggestedContent(id: string){
    const sp = new URLSearchParams();
    sp.set("id", String(id));
    const url = `/api/items/recommendations?${sp.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    const data : ApiResponse = await response.json();

    const items: ItemClient[] = data.items.map((item) => ({
        ...item,
        price: item.price.toString(),
    }));

    return items;
}

type SuggestedContentProps = {
    id: string
}

export default function SuggestedContent({id} : SuggestedContentProps){

    const [order, setOrder] = useState<number[]>([0,1,2,3,4]);
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
            if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load suggestions");
          } finally {
            if (!cancelled) setLoading(false);
          }
        })();
    
        return () => {
          cancelled = true;
        };
    }, [id]);

    const shiftLeft = () => {
        setOrder(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
      };
      
    const shiftRight = () => {
        setOrder(prev => [...prev.slice(1), prev[0]]);
    };

    if (loading) return <><Loading/></>;
    if (error) return <p>Error</p>;

    return (
            <div className={styles.container}>
                <div className={styles.suggestContentContainer}>
                    <span className={styles.carouselItemContainer}>
                    <img src={items[order[0]].image} width={75} height={75} className={styles.image}></img>
                    <img src={items[order[1]].image} width={75} height={75} className={styles.image}></img>
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
                            <Link href={`/Item/${items[order[2]].id}`}>
                                <SelectedSuggestion item={items[order[2]]} />
                            </Link>
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
                        <img src={items[order[3]].image} width={75} height={75} className={styles.image}></img>
                        <img src={items[order[4]].image} width={75} height={75} className={styles.image}></img>

                    </span>
                </div>
            </div>
    )
}