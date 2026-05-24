"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Loading from "../../Components/Loading";
import { getItemImageSrc } from "@/lib/images/imagepaths";
import { ItemType } from "@prisma/client";

import styles from "./HomeSearch.module.css";
import KeyWordSearch from "./KeyWordSearch";
import AddToBasket from "../../Components/AddToBasket";


type SearchItem = {
  id: number;
  name: string;
  type: ItemType;
  price: string;
  image: string;
  stock: number;
};

export default function HomeSearch() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // simple debounce
  const debouncedKeyword = useMemo(() => keyword.trim(), [keyword]);

  useEffect(() => {
    // reset when keyword changes
    setPage(1);
  }, [debouncedKeyword]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      const res = await fetch(
        `/api/items/search?q=${encodeURIComponent(debouncedKeyword)}&page=${page}&pageSize=10`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (cancelled) return;

      setHasMore(Boolean(data.hasMore));

      if (page === 1) setItems(data.items);
      else setItems((prev) => [...prev, ...data.items]);

      setLoading(false);
    }

    run().catch(() => setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [debouncedKeyword, page]);

  return (
    <div className={styles.homeSearchContainer}>
      <div className={styles.searchBar}>
        <KeyWordSearch keyword={keyword} setKeyword={setKeyword} />
      </div>

      <div className={styles.results}>
        {keyword.length > 0 && items.map((item) => (
          <Link key={item.id} href={`/Item/${item.id}`} >
          <div key={item.id} className={styles.result}>
            <Image src={getItemImageSrc(item.type, item.image)} width={110} height={110} alt={item.name} />
            <div className={styles.itemInfo}>
              <div className={styles.nameAndType}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemType}>{item.type}</p>
              </div>
              <p className={styles.price}>£{Number(item.price).toFixed(2)}</p>
            </div>
            <div className={styles.buttonContainer}>
              <AddToBasket itemId={item.id} secondary={true}/>
            </div>
          </div>
          </Link>
          
        ))}

      {loading && 
        <div className={styles.loading}>
          <Loading/>
        </div>
      }

        {!loading && hasMore && (keyword.length > 0) && (
          <button className={styles.button} onClick={() => setPage((p) => p + 1)}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
