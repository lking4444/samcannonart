import { prisma } from "@/lib/prisma"; 


export async function createOrderFromCheckoutSession(params: {
  sessionId: string;
  value: string;
  currency: string;
  userEmail: string;
  userPhoneNumber: string;
  userAddress: string;
  paidAt: Date;
  status: "PAID"; 
  items: { itemId: number; quantity: number; price: string }[];
}) {

  const existing = await prisma.order.findUnique({
    where: { SessionId: params.sessionId },
  });

  if (existing) return existing;

  return prisma.order.create({
    data: {
      SessionId: params.sessionId,
      value: params.value,
      currency: params.currency,
      userEmail: params.userEmail,
      userPhoneNumber: params.userPhoneNumber,
      userAddress: params.userAddress,
      status: params.status,
      paidAt: params.paidAt,
      items: {
        create: params.items.map((item) => ({
          quantity: item.quantity,
          unitPrice: item.price,
          item: {
            connect: { id: item.itemId },
          },
        })),
      },
    },
    include: { items: true },
  });
}

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

