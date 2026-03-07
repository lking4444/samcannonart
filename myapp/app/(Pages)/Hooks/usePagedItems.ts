"use client";

import { useCallback, useRef, useState } from "react";
import type { ItemType } from '@/app/generated/prisma/client';
import { ItemClient } from "../Types";

export type SortOrder = "High to Low" | "Low to High" | "Default";

type ApiResponse = {
    items: any[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
};

// Hook for item pagination 
export function usePagedItems(params: { type: ItemType; pageSize?: number }) {
    // Item type and size of page
    const { type, pageSize = 20 } = params;

    // State for managing page request info
    const [items, setItems] = useState<ItemClient[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // References to prevent stale values creating improper page updates
    const pageRef = useRef(1);
    const abortRef = useRef<AbortController | null>(null);
    const loadingRef = useRef(false); 
    console.log("fetchPage entry - loadingRef:", loadingRef.current);


    const fetchPage = useCallback(
        async (url: string, page: number, mode: "replace" | "append") => {
            console.log("fetchPage called", { page, mode, loading: loadingRef.current });
            // Uses ref to ensure if two requests are in flight before state update loading flag will be upto date
            if (loadingRef.current) return;
            
            // update loading ref to prevent other requests
            loadingRef.current = true; 
            // trigger rerender with loading UI
            setLoading(true);
            setError(null);
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            try {
                // fetch items either first page or new items
                const res = await fetch(url, {
                    cache: "no-store",
                    signal: abortRef.current.signal,
                });

                if (!res.ok) throw new Error(`Failed to load page ${page}`);

                const data: ApiResponse = await res.json();

                // Remove decimal type from price for compatibility
                const nextItems: ItemClient[] = data.items.map((item) => ({
                    ...item,
                    price: item.price.toString(),
                }));

                // Either replace existing updates or append no duplicate items to the list
                setItems((prev) => {
                    if (mode === "replace") return nextItems;

                    const seen = new Set(prev.map((x) => x.id));
                    return [...prev, ...nextItems.filter((x) => !seen.has(x.id))];
                });

                // Update current page ref and state 
                pageRef.current = data.page;
                setPage(data.page);
                setHasMore(data.hasMore);
            } catch (e: any) {
                // bypass abort errors
                if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error");
            } finally {
                // End loading
                loadingRef.current = false; 
                setLoading(false);
            }
        },
        // No dependencies needed due to useRef determining if loading
        [] 
    );

    const reset = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        loadingRef.current = false;
        pageRef.current = 1;
        setItems([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, []);

    return { type, pageSize, items, page,pageRef, hasMore, loading, error, fetchPage, reset };
}