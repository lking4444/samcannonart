"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ItemClient, ItemType } from "@/app/Types/items";
import { fetchAdminItems, fetchItemTags } from "@/lib/filtering/admin";

import styles from "./Filter.module.css";
  
type FilterProps = {
    items: ItemClient[];
    setItems: Dispatch<SetStateAction<ItemClient[]>>;
};

const PAGE_SIZE = 50;

export default function Filter({ items, setItems }: FilterProps) {

    const [tags, setTags] = useState<string[]>([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [type, setType] = useState<string>("Default");
    const [keyword, setKeyword] = useState("");
    const [tag, setTag] = useState<string>("Default");

    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
      
        async function loadTags() {
            try {
                setLoadingTags(true);
    
                const tags = await fetchItemTags();
        
                if (cancelled) return;
        
                setTags(tags ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) {
                    setLoadingTags(false);
                }
            }
        }
        loadTags();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        setPage(1);
    }, [type, keyword, tag]);

    useEffect(() => {
        let cancelled = false;
      
        async function run() {
          try {
            setLoading(true);
            setError("");
      
            const data = await fetchAdminItems({ page, PAGE_SIZE, keyword, type, tag, });
      
            if (cancelled) return;
      
            setItems(data.items ?? []);
            setHasMore(Boolean(data.hasMore));
          } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setError(err instanceof Error ? err.message : "Failed to load items");
                    setItems([]);
                    setHasMore(false);
                }
          } finally {
                if (!cancelled) {
                    setLoading(false);
                }
          }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [page, PAGE_SIZE, keyword, type, tag, setItems]);

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="type-filter">
                        Type
                    </label>
                    <select
                        id="type-filter"
                        className={styles.select}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Default">All types</option>
                        {Object.values(ItemType).map((itemType) => (
                            <option key={itemType} value={itemType}>
                                {itemType}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="tag-filter">
                        Tag
                    </label>
                    <select
                        id="tag-filter"
                        className={styles.select}
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        disabled={loadingTags}
                    >
                        <option value="Default">All tags</option>
                        {tags.map((tagOption) => (
                            <option key={tagOption} value={tagOption}>
                                {tagOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={`${styles.field} ${styles.searchField}`}>
                    <label className={styles.label} htmlFor="name-filter">
                        Name
                    </label>
                    <input
                        id="name-filter"
                        type="text"
                        className={styles.input}
                        placeholder="Search by item name"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.topRow}>
                <div className={styles.meta}>
                    <span>Page {page}</span>
                    {!loading && !error && <span>{items.length} shown</span>}
                </div>
                <div className={styles.pagination}>
                    <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!hasMore || loading}
                    >
                        Next
                    </button>
                </div>
            </div>

            {loading && <p className={styles.status}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && items.length === 0 && (
                <p className={styles.status}>No items found.</p>
            )}
        </div>
    );
    }