import { NextResponse } from "next/server";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { updateOrder } from "@/lib/db/order";

const VALID_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PAID,
  OrderStatus.SHIPPED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
];

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const sessionId =
      typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    const status = body?.status as OrderStatus | undefined;
    const updatedAt =
      typeof body?.updatedAt === "string" ? body.updatedAt : undefined;

    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing sessionId." },
        { status: 400 }
      );
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status." },
        { status: 400 }
      );
    }

    const order = await updateOrder({
      sessionId,
      status,
      updatedAt,
    });

    const serialisedOrder = {
      value: order.value.toString(),
      currency: order.currency,
      SessionId: order.SessionId,
      userEmail: order.userEmail,
      userPhoneNumber: order.userPhoneNumber,
      userAddress: order.userAddress,
      status: order.status,
      paidAt: order.paidAt?.toISOString() ?? null,
      cancelledAt: order.cancelledAt?.toISOString() ?? null,
      refundedAt: order.refundedAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((orderItem) => ({
        itemId: orderItem.itemId,
        quantity: orderItem.quantity,
        unitPrice: orderItem.unitPrice.toString(),
        item: orderItem.item
          ? {
              name: orderItem.item.name,
              imageUrl: orderItem.item.image ?? null,
              description: orderItem.item.description ?? null,
            }
          : undefined,
      })),
    };

    return NextResponse.json(serialisedOrder, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order.";

    const status =
      message === "Order not found."
        ? 404
        : message.includes("updated elsewhere")
        ? 409
        : 500;

    return NextResponse.json({ message }, { status });
  }
}