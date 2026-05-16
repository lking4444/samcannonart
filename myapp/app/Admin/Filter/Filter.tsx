"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import type { ItemClient } from "../../(Pages)/Types";
import { ItemType } from "@/app/Types/items";

import styles from "./Filter.module.css";

type AdminItemsResponse = {
  items: ItemClient[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  error?: string;
};

type TagsResponse = {
  tags: string[];
  error?: string;
};

type FilterProps = {
    items: ItemClient[];
    setItems: Dispatch<SetStateAction<ItemClient[]>>;
  };
  
  export default function Filter({ items, setItems }: FilterProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<string>("Default");
  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState<string>("Default");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;

    async function loadTags() {
      setLoadingTags(true);

      const res = await fetch("/Admin/api/items/tags", {
        cache: "no-store",
      });

      const data: TagsResponse = await res.json();

      if (cancelled) return;

      setTags(data.tags ?? []);
      setLoadingTags(false);
    }

    loadTags().catch(() => {
      if (!cancelled) setLoadingTags(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [type, keyword, tag]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");

      const sp = new URLSearchParams();
      sp.set("page", String(page));
      sp.set("pageSize", String(pageSize));
      sp.set("keyword", keyword.trim());

      if (type !== "Default") sp.set("type", type);
      if (tag !== "Default") sp.set("tag", tag);

      const res = await fetch(`/Admin/api/items?${sp.toString()}`, {
        cache: "no-store",
      });

      const data: AdminItemsResponse = await res.json();

      if (cancelled) return;

      if (!res.ok) {
        setError(data.error ?? "Failed to load items");
        setItems([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setItems(data.items ?? []);
      setHasMore(Boolean(data.hasMore));
      setLoading(false);
    }

    run().catch(() => {
      if (!cancelled) {
        setError("Failed to load items");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [page, type, keyword, tag]);

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