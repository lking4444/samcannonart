import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { validateRule } from "@/lib/shipping/rules";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rules = await prisma.shippingRule.findMany({
    orderBy: { name: "asc" },
    include: {
      tiers: { orderBy: [{ region: "asc" }, { minQuantity: "asc" }] },
      _count: { select: { items: true } },
    },
  });
  return NextResponse.json(rules);
}

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  let data;
  try {
    body = await request.json();
    data = validateRule(body);
    if (body.id !== undefined && (typeof body.id !== "string" || !body.id))
      throw new Error("Invalid rule ID.");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid rule." },
      { status: 400 },
    );
  }
  try {
    const { tiers, ...fields } = data;
    const rule = await prisma.$transaction(
      async (tx) => {
        if (body.id) {
          await tx.shippingTier.deleteMany({
            where: { shippingRuleId: body.id },
          });
          return tx.shippingRule.update({
            where: { id: body.id },
            data: { ...fields, tiers: { create: tiers } },
          });
        }
        return tx.shippingRule.create({
          data: { ...fields, tiers: { create: tiers } },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return NextResponse.json(rule);
  } catch (error) {
    const code =
      error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "";
    if (code === "P2002")
      return NextResponse.json(
        { error: "A rule with this name already exists." },
        { status: 409 },
      );
    if (code === "P2025" || code === "P2034")
      return NextResponse.json(
        {
          error: "The rule changed or no longer exists. Reload and try again.",
        },
        { status: 409 },
      );
    console.error("Shipping rule save failed", error);
    return NextResponse.json(
      { error: "Unable to save shipping rule." },
      { status: 500 },
    );
  }
}
