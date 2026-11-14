import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    !Array.isArray(body.itemIds) ||
    !body.itemIds.length ||
    body.itemIds.length > 500 ||
    body.itemIds.some(
      (id: unknown) =>
        typeof id !== "number" || !Number.isSafeInteger(id) || id < 1,
    ) ||
    !(
      body.shippingRuleId === null ||
      (typeof body.shippingRuleId === "string" &&
        body.shippingRuleId.length > 0)
    )
  ) {
    return NextResponse.json(
      { error: "Select 1–500 products and a shipping rule or Default." },
      { status: 400 },
    );
  }
  const ids = [...new Set<number>(body.itemIds)];
  try {
    await prisma.$transaction(
      async (tx) => {
        if (body.shippingRuleId !== null) {
          const rule = await tx.shippingRule.findUnique({
            where: { id: body.shippingRuleId },
          });
          if (!rule || rule.archived)
            throw new Error("Choose an active shipping rule.");
        }
        const count = await tx.item.count({ where: { id: { in: ids } } });
        if (count !== ids.length)
          throw new Error("Some products no longer exist. Refresh the list.");
        await tx.item.updateMany({
          where: { id: { in: ids } },
          data: { shippingRuleId: body.shippingRuleId },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return NextResponse.json({ count: ids.length });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Products or rules changed. Refresh and try again." },
        { status: 409 },
      );
    }
    console.error("Shipping assignment failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error &&
          (error.message.startsWith("Choose") ||
            error.message.startsWith("Some products"))
            ? error.message
            : "Unable to assign products.",
      },
      { status: 400 },
    );
  }
}
