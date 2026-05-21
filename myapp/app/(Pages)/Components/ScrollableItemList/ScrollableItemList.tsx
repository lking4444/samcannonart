"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ItemType } from "@/app/generated/prisma/client";

import Loading from "../Loading";
import ItemTile from "../ItemTile";
import SearchFilter from "../SearchFilter";
import { useDebouncedValue } from "./Hooks/useDebouncedValue";
import { SortOrder, usePagedItems } from "../../Hooks/usePagedItems";

import styles from "./ScollableItemList.module.css";

export default function ItemListInfiniteServerFiltered({type, pageSize = 20,}: {type: ItemType; pageSize?: number;}) {
    const sortOrders: SortOrder[] = ["High to Low", "Low to High", "Default"];

    // UI filters
    const [dimension, setDimension] = useState<string | undefined>("Default");
    const [keyword, setKeyword] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string | undefined>("Default");
    const [tag, setTag] = useState<string | undefined>("Default");
    const [allTags, setAllTags] = useState<string[]>([]);

    const isInitialisingRef = useRef(true);
    const debouncedKeyword = useDebouncedValue(keyword, 250);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // hook state (items/pagination)
    const { items, page ,pageRef, hasMore, loading, error, fetchPage, reset } = usePagedItems({
        type,
        pageSize,
    });

    // build URL for the API using filters
    const buildUrl = useCallback(
        (p: number) => {
            const sp = new URLSearchParams();
            sp.set("type", String(type));
            sp.set("page", String(p));
            sp.set("pageSize", String(pageSize));
            sp.set("keyword", debouncedKeyword);
            sp.set("dimension", dimension ?? "Default");
            sp.set("sortOrder", sortOrder ?? "Default");
            sp.set("tag", tag ?? "Default");
            return `/api/items/by-type?${sp.toString()}`;
        },
        [type, pageSize, debouncedKeyword, dimension, sortOrder, tag]
    );

    // load all tags on mount and item type change
    useEffect(() => {
        let cancelled = false;
    
        async function loadTags() {
            try {
                const res = await fetch(`/api/items/tags?type=${type}`);
                if (!res.ok) throw new Error("Failed to fetch tags");
    
                const data: { tags: string[] } = await res.json();
    
                if (!cancelled) { setAllTags(data.tags ?? []); }
            } catch (err) {
                console.error(err);
                if (!cancelled) { setAllTags([]); }
            }
        }
        loadTags();
        return () => { cancelled = true; };
    }, [type]);

    // load page 1 on mount + when filters change
    useEffect(() => {
        // prevents additional pages loads until the first page load
        isInitialisingRef.current = true;
        reset();
      
        const sp = new URLSearchParams();
        sp.set("type", String(type));
        sp.set("page", "1");
        sp.set("pageSize", String(pageSize));
        sp.set("keyword", debouncedKeyword ?? "");
        sp.set("dimension", dimension ?? "Default");
        console.log(tag);
        sp.set("tag", tag ?? "Default");
        sp.set("sortOrder", sortOrder ?? "Default");
      
        fetchPage(`/api/items/by-type?${sp.toString()}`, 1, "replace");
      }, [type, pageSize, debouncedKeyword, dimension, sortOrder, tag]);


    // load next page when scrolling
    const loadNext = useCallback(() => {
        // prevents loading if there are no more items, if the first page hasn't loaded, if there is a current loading state
        if (isInitialisingRef.current) return;
        if (loading || !hasMore) return;

        // update page based on current page ref 
        const nextPage = pageRef.current + 1;
        fetchPage(buildUrl(nextPage), nextPage, "append");
    }, [loading, hasMore, fetchPage, buildUrl]);

    // prevents second page load until the first page has loaded
    useEffect(() => {
        if (items.length > 0) { isInitialisingRef.current = false; }
    }, [items]);

    // IntersectionObserver to trigger infinite scroll
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
    
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadNext();
            },
            { root: null, rootMargin: "300px", threshold: 0 }
        );
    
        obs.observe(el);
        return () => obs.disconnect();
    }, [loadNext]);

    // dimension options based on the currently loaded items
    const dimensionOptions = useMemo(() => {
        return ["Default", ...new Set(items.map((i) => i.dimensions).filter((d): d is string => d != null)), ];
    }, [items]);

    const tagOptions = useMemo(() => {
        return ["Default", ...allTags];
    }, [allTags]);

    return (
        <>
            <SearchFilter
                keyword={keyword}
                setKeyword={setKeyword}
                dimensionOptions={dimensionOptions}
                setDimension={setDimension}
                tagOptions={tagOptions}
                setTag={setTag}
                sortOrder={sortOrders}
                setSortOrder={setSortOrder}
            />
            <div className={styles.tileContainer}>
                {items.map((item) => (
                    <ItemTile key={item.id} item={item} />
                ))}
            </div>
            {error && <p style={{ marginTop: 12 }}>Error: {error}</p>}
            {loading && <Loading/>}
            {!hasMore && !loading && (
                <p style={{ marginTop: 12 }}>You’ve reached the end</p>
            )}
            <div ref={sentinelRef} style={{ height: 1 }} />
        </>
    );
}