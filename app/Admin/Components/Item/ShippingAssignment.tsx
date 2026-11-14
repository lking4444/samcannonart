"use client";
import { useState } from "react";

type Rule = { id: string; name: string; archived: boolean };
export default function ShippingAssignment({
  itemId,
  initialRuleId,
}: {
  itemId: number;
  initialRuleId: string | null;
}) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [value, setValue] = useState(initialRuleId ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function load() {
    try {
      const res = await fetch("/Admin/api/shipping-rules", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Unable to load shipping rules.");
      setRules(await res.json());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to load rules.");
    }
  }
  async function assign(next: string) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/Admin/api/shipping-rules/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIds: [itemId],
          shippingRuleId: next || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValue(next);
      setMessage("Shipping saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save shipping.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <span>
      <label>
        Shipping (saves immediately)
        <select
          value={value}
          disabled={busy}
          onFocus={load}
          onChange={(e) => assign(e.target.value)}
        >
          <option value="">Default</option>
          {value && !rules.some((r) => r.id === value) && (
            <option value={value}>Current custom rule</option>
          )}
          {rules
            .filter((r) => !r.archived || r.id === value)
            .map((r) => (
              <option key={r.id} value={r.id} disabled={r.archived}>
                {r.name}
                {r.archived ? " (archived)" : ""}
              </option>
            ))}
        </select>
      </label>
      {message && <small role="status">{message}</small>}
    </span>
  );
}
