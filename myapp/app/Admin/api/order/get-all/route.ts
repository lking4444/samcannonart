import { getAllOrders } from "@/lib/db/order";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { NextResponse } from "next/server";
import { fromMinorUnits } from "@/lib/orders/orderDisplay";
  
export async function GET() {
    const session = await requireAdmin();

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
        
    try {
        const orders = await getAllOrders();

        const serialisedOrders = orders.map((order) => ({
            value: fromMinorUnits(order.value.toString()),
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
                unitPrice: orderItem.unitPrice,
                item: orderItem.item
                ? {
                    name: orderItem.item.name,
                    imageUrl: orderItem.item.image ?? null,
                    description: orderItem.item.description ?? null,
                    type: orderItem.item.type ?? null
                    }
                : undefined,
            })),
        }));

        return NextResponse.json(serialisedOrders, { status: 200 });
    } catch (error) {
        console.error("GET /api/order/get-all failed:", error);

        return NextResponse.json(
            { message: "Failed to fetch orders." },
            { status: 500 }
        );
    }
}