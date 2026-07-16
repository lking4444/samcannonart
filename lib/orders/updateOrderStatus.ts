import { DisplayOrder, OrderStatus } from "@/lib/orders/orderDisplay";

type UpdateOrderStatusInput = {
    sessionId: string;
    status: OrderStatus;
    updatedAt: string;
};

export async function updateOrderStatus({ sessionId, status, updatedAt, }: UpdateOrderStatusInput): Promise<DisplayOrder> {
    const response = await fetch("/Admin/api/order/by-id", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        sessionId,
        status,
        updatedAt,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to update order.");
    }

    return data;
}