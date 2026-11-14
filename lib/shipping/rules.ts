export type Region = "UK" | "INTERNATIONAL";
export type Tier = {
  region: Region;
  minQuantity: number;
  maxQuantity: number | null;
  priceInPence: number;
};
export type RuleInput = { name: string; archived: boolean; tiers: Tier[] };

export function validateRule(input: unknown): RuleInput {
  if (!input || typeof input !== "object")
    throw new Error("Invalid shipping rule.");
  const data = input as Record<string, unknown>;
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.trim().length > 100
  )
    throw new Error("Enter a name of 1–100 characters.");
  if (typeof data.archived !== "boolean")
    throw new Error("Invalid archive setting.");
  if (!Array.isArray(data.tiers) || data.tiers.length > 200)
    throw new Error("Enter up to 200 shipping tiers.");
  const tiers: Tier[] = data.tiers.map((row: unknown) => {
    if (!row || typeof row !== "object") throw new Error("Invalid tier.");
    const t = row as Tier;
    if (t.region !== "UK" && t.region !== "INTERNATIONAL")
      throw new Error("Invalid shipping region.");
    if (
      !Number.isInteger(t.minQuantity) ||
      t.minQuantity < 1 ||
      t.minQuantity > 2147483647 ||
      (t.maxQuantity !== null &&
        (!Number.isInteger(t.maxQuantity) ||
          t.maxQuantity < t.minQuantity ||
          t.maxQuantity > 2147483647))
    )
      throw new Error("Quantity ranges must contain positive whole numbers.");
    if (
      !Number.isInteger(t.priceInPence) ||
      t.priceInPence < (t.region === "INTERNATIONAL" ? 1 : 0) ||
      t.priceInPence > 2147483647
    )
      throw new Error(
        "Enter valid prices; international postage must be greater than £0.",
      );
    return {
      region: t.region,
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      priceInPence: t.priceInPence,
    };
  });
  for (const region of ["UK", "INTERNATIONAL"] as const) {
    const rows = tiers
      .filter((t) => t.region === region)
      .sort((a, b) => a.minQuantity - b.minQuantity);
    let next: number | null = 1;
    if (!rows.length) throw new Error(`Add ${region} tiers.`);
    for (const row of rows) {
      if (next === null || row.minQuantity !== next)
        throw new Error(
          `${region}: ranges must start at 1 with no gaps or overlaps.`,
        );
      next = row.maxQuantity === null ? null : row.maxQuantity + 1;
    }
    if (next !== null)
      throw new Error(
        `${region}: leave the final upper quantity blank for no limit.`,
      );
  }
  return { name: data.name.trim(), archived: data.archived, tiers };
}

export function validateQuantities(items: { quantity: number }[]) {
  if (
    items.some(
      (item) => !Number.isSafeInteger(item.quantity) || item.quantity < 1,
    )
  )
    throw new Error("Invalid item quantity.");
}

export function tierPrice(
  tiers: Tier[],
  region: Region,
  quantity: number,
): number {
  const matches = tiers.filter(
    (t) =>
      t.region === region &&
      quantity >= t.minQuantity &&
      (t.maxQuantity === null || quantity <= t.maxQuantity),
  );
  if (matches.length !== 1)
    throw new Error("No unique shipping tier for this quantity.");
  const price = matches[0].priceInPence;
  if (!Number.isInteger(price) || price < (region === "INTERNATIONAL" ? 1 : 0))
    throw new Error("Invalid shipping price.");
  return price;
}

export function customShippingCharges(
  items: {
    quantity: number;
    shippingRuleId: string | null;
    shippingRule: { tiers: Tier[] } | null;
  }[],
  region: Region,
): number[] {
  const groups = new Map<string, { quantity: number; tiers: Tier[] }>();
  for (const item of items) {
    if (item.shippingRuleId === null) continue;
    if (!item.shippingRuleId || !item.shippingRule)
      throw new Error("Missing shipping rule. Refresh and try again.");
    const group = groups.get(item.shippingRuleId) ?? {
      quantity: 0,
      tiers: item.shippingRule.tiers,
    };
    group.quantity += item.quantity;
    groups.set(item.shippingRuleId, group);
  }
  return [...groups.values()].map(
    (g) => tierPrice(g.tiers, region, g.quantity) / 100,
  );
}
