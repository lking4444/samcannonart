import { ITEM_TYPE } from "@/app/Types/items";

export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED";

export type DisplayOrderItem = {
    itemId: number;
    quantity: number;
    unitPrice: string;
    item?: {
        name?: string;
        imageUrl?: string | null;
        description?: string | null;
        type?: ITEM_TYPE;   
    };
};

export type DisplayOrder = {
    value: string;
    currency: string;
    SessionId: string;

    userEmail: string;
    userPhoneNumber: string;
    userAddress: string;

    status: OrderStatus;
    paidAt?: string | null;
    cancelledAt?: string | null;
    refundedAt?: string | null;

    createdAt: string;
    updatedAt: string;

    items: DisplayOrderItem[];
};

export const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const ORDER_STATUSES: OrderStatus[] = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED",
];

export function formatMoney(value: string, currency: string) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return `${value} ${currency}`;

    try {
        return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        }).format(numericValue);
    } catch {
        return `${value} ${currency}`;
    }
}

export function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    const day = date.getUTCDate();
    const month = MONTHS[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

export async function getOrders(): Promise<DisplayOrder[]> {
    const response = await fetch("/Admin/api/order/get-all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to fetch orders.");
    }

    return response.json();
}
