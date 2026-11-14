"use client";
import { useEffect, useState } from "react";
import { ItemType } from "@/app/Types/items";
import { Region, Tier, tierPrice, validateRule } from "@/lib/shipping/rules";
import styles from "./Shipping.module.css";

type Rule = {
  id: string;
  name: string;
  archived: boolean;
  tiers: Tier[];
  _count: { items: number };
};
type Row = { from: string; to: string; uk: string; international: string };
type Product = {
  id: number;
  name: string;
  type: string;
  uploadId: string | null;
  shippingRuleId: string | null;
};
const emptyRows = (): Row[] => [
  { from: "1", to: "", uk: "", international: "" },
];
async function request(url: string, data?: unknown) {
  const res = await fetch(
    url,
    data === undefined
      ? { cache: "no-store" }
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
  );
  const body = await res.json();
  if (!res.ok)
    throw new Error(body.error ?? "Request failed. Please try again.");
  return body;
}
function tiersFromRows(rows: Row[]): Tier[] {
  return rows.flatMap((row) =>
    (["UK", "INTERNATIONAL"] as Region[]).map((region) => {
      const price = region === "UK" ? row.uk : row.international;
      if (!/^\d+(\.\d{1,2})?$/.test(price))
        throw new Error(
          "Enter prices in pounds with up to two decimal places.",
        );
      return {
        region,
        minQuantity: Number(row.from),
        maxQuantity: row.to === "" ? null : Number(row.to),
        priceInPence: Math.round(Number(price) * 100),
      };
    }),
  );
}

export default function ShippingAdmin() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [archived, setArchived] = useState(false);
  const [rows, setRows] = useState<Row[]>(emptyRows);
  const [previewQuantity, setPreviewQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("");
  const [assignment, setAssignment] = useState("default");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    request("/Admin/api/shipping-rules")
      .then((data) => {
        if (active) setRules(data);
      })
      .catch((e) => {
        if (active) setMessage(e.message);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setSelected([]);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "30",
      keyword,
      type: category,
      shippingRule: filter,
    });
    request(`/Admin/api/items?${params}`)
      .then((data) => {
        if (!active) return;
        setProducts(data.items);
        setTotal(data.total);
        setHasMore(data.hasMore);
      })
      .catch((e) => {
        if (active) {
          setProducts([]);
          setMessage(e.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, keyword, category, filter, revision]);

  function edit(rule?: Rule) {
    setId(rule?.id ?? "");
    setName(rule?.name ?? "");
    setArchived(rule?.archived ?? false);
    if (!rule) {
      setRows(emptyRows());
      return;
    }
    // The editor uses common boundaries for the two regions. Split existing
    // ranges at every boundary so independently stored tiers remain lossless.
    const starts = [...new Set(rule.tiers.map((t) => t.minQuantity))].sort(
      (a, b) => a - b,
    );
    setRows(
      starts.map((start, i) => ({
        from: String(start),
        to: i === starts.length - 1 ? "" : String(starts[i + 1] - 1),
        uk: (tierPrice(rule.tiers, "UK", start) / 100).toFixed(2),
        international: (
          tierPrice(rule.tiers, "INTERNATIONAL", start) / 100
        ).toFixed(2),
      })),
    );
  }
  function updateRow(index: number, field: keyof Row, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const data = validateRule({ name, archived, tiers: tiersFromRows(rows) });
      const saved = await request("/Admin/api/shipping-rules", {
        ...data,
        ...(id ? { id } : {}),
      });
      setId(saved.id);
      setRevision((v) => v + 1);
      setMessage(
        "Shipping rule saved. Assigned products now use these prices.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save rule.");
    } finally {
      setBusy(false);
    }
  }
  async function assign() {
    setBusy(true);
    setMessage("");
    try {
      const result = await request("/Admin/api/shipping-rules/assign", {
        itemIds: selected,
        shippingRuleId: assignment === "default" ? null : assignment,
      });
      setSelected([]);
      setRevision((v) => v + 1);
      setMessage(`Updated shipping for ${result.count} product(s).`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to assign products.");
    } finally {
      setBusy(false);
    }
  }
  let preview = "Complete valid ranges and prices to preview.";
  try {
    const quantity = Number(previewQuantity);
    if (Number.isSafeInteger(quantity) && quantity > 0) {
      const rule = validateRule({
        name: name || "Preview",
        archived,
        tiers: tiersFromRows(rows),
      });
      preview = `For ${quantity}: UK £${(tierPrice(rule.tiers, "UK", quantity) / 100).toFixed(2)} · International £${(tierPrice(rule.tiers, "INTERNATIONAL", quantity) / 100).toFixed(2)}`;
    }
  } catch {
    /* Incomplete editor input is expected. */
  }
  return (
    <div className={styles.page}>
      <h1>Shipping rules</h1>
      <p>
        Each named rule groups its products together. Quantities are added
        within each group, and the highest group charge is used.
      </p>
      <p>
        UK: free with any original or a product subtotal of £125 or more.
        International: always charged, with no free-delivery threshold.
      </p>
      {message && (
        <p role="status" className={styles.message}>
          {message}
        </p>
      )}
      <section className={styles.card}>
        <h2>{id ? "Edit shipping rule" : "Create shipping rule"}</h2>
        <fieldset disabled={busy}>
          <div className={styles.toolbar}>
            <label>
              Existing rule
              <select
                value={id}
                onChange={(e) =>
                  edit(rules.find((r) => r.id === e.target.value))
                }
              >
                <option value="">New rule</option>
                {rules.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.archived ? " (archived)" : ""} — {r._count.items}{" "}
                    products
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => edit()}>New rule</button>
          </div>
          <div className={styles.toolbar}>
            <label>
              Rule name
              <input
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Card packs"
              />
            </label>
            <label>
              <span>Archived</span>
              <input
                type="checkbox"
                checked={archived}
                onChange={(e) => setArchived(e.target.checked)}
              />
            </label>
          </div>
          <p>
            Prices are the total postage for the group. Use the same From and To
            for a single quantity. Leave the final To blank for no limit.
          </p>
          <div className={styles.scroll}>
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>UK (£)</th>
                  <th>International (£)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {(["from", "to", "uk", "international"] as const).map(
                      (field) => (
                        <td key={field}>
                          <input
                            aria-label={`${field} for range ${index + 1}`}
                            type="number"
                            min={
                              field === "uk"
                                ? "0"
                                : field === "international"
                                  ? "0.01"
                                  : "1"
                            }
                            step={
                              field === "uk" || field === "international"
                                ? "0.01"
                                : "1"
                            }
                            placeholder={field === "to" ? "No limit" : ""}
                            value={row[field]}
                            onChange={(e) =>
                              updateRow(index, field, e.target.value)
                            }
                          />
                        </td>
                      ),
                    )}
                    <td>
                      <button
                        disabled={rows.length === 1}
                        onClick={() =>
                          setRows((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() =>
              setRows((current) => [
                ...current,
                {
                  from: current.at(-1)?.to
                    ? String(Number(current.at(-1)!.to) + 1)
                    : "",
                  to: "",
                  uk: "",
                  international: "",
                },
              ])
            }
          >
            Add quantity range
          </button>
          <div className={styles.toolbar}>
            <label>
              Preview quantity
              <input
                type="number"
                min="1"
                step="1"
                value={previewQuantity}
                onChange={(e) => setPreviewQuantity(e.target.value)}
              />
            </label>
            <p>{preview}</p>
          </div>
          <p>
            Archived rules keep working for products already assigned to them
            but cannot be assigned to more products.
          </p>
          <button className={styles.primary} onClick={save}>
            {busy ? "Saving…" : "Save rule"}
          </button>
        </fieldset>
      </section>
      <section className={styles.card}>
        <h2>Assign products</h2>
        <p>
          Spreadsheet uploads use Default for new products. Existing upload IDs
          are skipped, preserving their shipping assignments.
        </p>
        <div className={styles.toolbar}>
          <label>
            Search products
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {Object.values(ItemType).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Current shipping
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All shipping rules</option>
              <option value="default">Default</option>
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.archived ? " (archived)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.toolbar}>
          <label>
            Assign selected to
            <select
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
            >
              <option value="default">Default</option>
              {rules
                .filter((r) => !r.archived)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
          <button
            className={styles.primary}
            disabled={busy || loading || !selected.length}
            onClick={assign}
          >
            Assign {selected.length} selected
          </button>
        </div>
        {loading ? (
          <p role="status">Loading products…</p>
        ) : (
          <div className={styles.scroll}>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      aria-label="Select all products on this page"
                      type="checkbox"
                      checked={
                        products.length > 0 &&
                        selected.length === products.length
                      }
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? products.map((p) => p.id) : [],
                        )
                      }
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Shipping</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        aria-label={`Select ${p.name}`}
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={(e) =>
                          setSelected((current) =>
                            e.target.checked
                              ? [...current, p.id]
                              : current.filter((id) => id !== p.id),
                          )
                        }
                      />
                    </td>
                    <td>
                      {p.name}
                      <br />
                      <small>{p.uploadId ?? `#${p.id}`}</small>
                    </td>
                    <td>{p.type}</td>
                    <td>
                      {p.shippingRuleId
                        ? (rules.find((r) => r.id === p.shippingRuleId)?.name ??
                          "Custom rule")
                        : "Default"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!products.length && <p>No matching products.</p>}
          </div>
        )}
        <div className={styles.toolbar}>
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} · {total} products
          </span>
          <button
            disabled={!hasMore || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
