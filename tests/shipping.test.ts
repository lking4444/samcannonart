import test from "node:test";
import assert from "node:assert/strict";
import { computeShipping } from "../lib/shipping/calculateShipping";
import { computeInternationalShipping } from "../lib/shipping/calculateInternationShipping";
import { validateRule, Tier } from "../lib/shipping/rules";
import type { DbItem } from "../app/Types/items";

function item(
  data: Partial<DbItem & { quantity: number }> = {},
): DbItem & { quantity: number } {
  return {
    id: 1,
    name: "Test",
    image: "",
    type: "CARD",
    price: 1,
    dimensions: null,
    gift: null,
    quantity: 1,
    shippingRuleId: null,
    shippingRule: null,
    ...data,
  };
}
const tiers: Tier[] = [
  ...[
    { minQuantity: 1, maxQuantity: 2, priceInPence: 400 },
    { minQuantity: 3, maxQuantity: 5, priceInPence: 700 },
    { minQuantity: 6, maxQuantity: 7, priceInPence: 800 },
    { minQuantity: 8, maxQuantity: 10, priceInPence: 1000 },
    { minQuantity: 11, maxQuantity: null, priceInPence: 1200 },
  ].map((t) => ({ ...t, region: "UK" as const })),
  {
    region: "INTERNATIONAL",
    minQuantity: 1,
    maxQuantity: null,
    priceInPence: 3000,
  },
];
const custom = (data = {}): DbItem & { quantity: number } =>
  item({ shippingRuleId: "packs", shippingRule: { tiers }, ...data });

test("UK free threshold includes exactly £125 but not £124.99", () => {
  assert.equal(computeShipping([item({ price: 124.99 })]), 1.8);
  assert.equal(computeShipping([item({ price: 125 })]), 0);
  assert.equal(computeShipping([custom({ price: 62.5, quantity: 2 })]), 0);
});
test("any original makes the entire UK basket free, including custom originals", () => {
  assert.equal(computeShipping([item({ type: "ORIGINAL" }), custom()]), 0);
  assert.equal(computeShipping([custom({ type: "ORIGINAL" }), item()]), 0);
});
test("custom and default print quantities remain independent", () => {
  const prints = [
    item({ type: "PRINT", dimensions: "20x20", quantity: 2 }),
    custom({ type: "PRINT", dimensions: "20x20", quantity: 2 }),
  ];
  assert.equal(computeShipping(prints), 4.65);
  assert.equal(computeInternationalShipping(prints), 30);
});
test("different products on the same rule combine, different rules do not", () => {
  assert.equal(
    computeShipping([
      custom({ id: 1, quantity: 2 }),
      custom({ id: 2, quantity: 2 }),
    ]),
    7,
  );
  assert.equal(
    computeShipping([
      custom({ quantity: 2 }),
      custom({ shippingRuleId: "another", quantity: 2 }),
    ]),
    4,
  );
});
test("all custom quantity boundaries, including open-ended final tier", () => {
  for (const [quantity, cost] of [
    [1, 4],
    [2, 4],
    [3, 7],
    [5, 7],
    [6, 8],
    [7, 8],
    [8, 10],
    [10, 10],
    [11, 12],
    [20, 12],
  ])
    assert.equal(computeShipping([custom({ quantity })]), cost);
});
test("international originals participate in max and never make shipping free", () => {
  assert.equal(
    computeInternationalShipping([item({ type: "ORIGINAL" })]),
    17.53,
  );
  assert.equal(
    computeInternationalShipping([item({ type: "ORIGINAL" }), custom()]),
    30,
  );
  assert.equal(
    computeInternationalShipping([custom({ type: "ORIGINAL" })]),
    30,
  );
  assert.equal(computeInternationalShipping([item({ price: 200 })]), 8.6);
});
test("missing and zero international prices fail rather than giving free shipping", () => {
  assert.throws(() => computeInternationalShipping([item({ type: "SLATE" })]));
  assert.throws(() =>
    computeInternationalShipping([custom({ shippingRule: null })]),
  );
  assert.throws(() =>
    computeInternationalShipping([
      custom({
        shippingRule: {
          tiers: [
            {
              region: "INTERNATIONAL",
              minQuantity: 1,
              maxQuantity: null,
              priceInPence: 0,
            },
          ],
        },
      }),
    ]),
  );
  assert.throws(() =>
    computeShipping([custom({ shippingRule: { tiers: [] } })]),
  );
});
test("invalid quantities are rejected", () => {
  for (const quantity of [0, -1, 1.5, NaN])
    assert.throws(() => computeShipping([custom({ quantity })]));
});
test("rule validation accepts complete regions and rejects gaps, overlaps, missing region and invalid prices", () => {
  assert.equal(
    validateRule({ name: " Packs ", archived: false, tiers }).name,
    "Packs",
  );
  for (const invalid of [
    tiers.filter((t) => t.minQuantity !== 3),
    [...tiers, tiers[0]],
    tiers.filter((t) => t.region === "UK"),
    tiers.map((t) => ({ ...t, priceInPence: -1 })),
    tiers.map((t) => ({ ...t, maxQuantity: t.maxQuantity ?? 100 })),
    tiers.map((t) => ({ ...t, priceInPence: 0 })),
  ]) {
    assert.throws(() =>
      validateRule({ name: "Packs", archived: false, tiers: invalid }),
    );
  }
});
