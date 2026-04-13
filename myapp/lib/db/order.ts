
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/app/generated/prisma/enums';

type OrderItems = {
    itemId: number, 
    price: string,
    quantity: number
}

type CreateOrderInput = {
    value: string;
    currency: string;
    userEmail: string;
    userPhoneNumber: string;
    userAddress: string;
    status: OrderStatus;
    sessionId: string;
    paidAt: Date;
    items: OrderItems[];
};

type UpdateOrderInput = {
    sessionId: string;
    status: OrderStatus;
    updatedAt?: string;
  };

export async function createOrder(data : CreateOrderInput){
    const now = new Date()

    await prisma.order.create({
        data: {
          value: data.value,
          currency: data.currency,
          userEmail: data.userEmail,
          userPhoneNumber: data.userPhoneNumber,
          userAddress: data.userAddress,
          status: data.status,
          paidAt: data.paidAt,
          SessionId: data.sessionId,
          items : {
            create : data.items.map(item =>
                ({
                    itemId: item.itemId, 
                    quantity: item.quantity,
                    unitPrice: item.price,
                })),
          },
        },
        include: { items: true },
      })
}

export async function getAllOrders() {
  return prisma.order.findMany({
    select: {
      value: true,
      currency: true,
      SessionId: true,
      userEmail: true,
      userAddress: true,
      userPhoneNumber: true,
      status: true,
      paidAt: true,
      cancelledAt: true,
      refundedAt: true,
      updatedAt: true,
      createdAt: true,
      items: {
        select: {
          quantity: true,
          unitPrice: true,
          itemId: true,
          item: {
            select: {
                image: true,
                name: true,
                description: true,
            }
          }
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateOrder(data: UpdateOrderInput) {
    const existingOrder = await prisma.order.findUnique({
      where: {
        SessionId: data.sessionId,
      },
      select: {
        SessionId: true,
        status: true,
        paidAt: true,
        cancelledAt: true,
        refundedAt: true,
        updatedAt: true,
        value: true,
        currency: true,
        userEmail: true,
        userPhoneNumber: true,
        userAddress: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            itemId: true,
            item: {
              select: {
                image: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  
    if (!existingOrder) {
      throw new Error("Order not found.");
    }
  
    if (data.updatedAt) {
      const incomingUpdatedAt = new Date(data.updatedAt);
      if (
        !Number.isNaN(incomingUpdatedAt.getTime()) &&
        existingOrder.updatedAt.getTime() !== incomingUpdatedAt.getTime()
      ) {
        throw new Error("This order was updated elsewhere. Please refresh and try again.");
      }
    }
  
    const updateData: {
      status: OrderStatus;
      paidAt?: Date;
      cancelledAt?: Date;
      refundedAt?: Date;
    } = {
      status: data.status,
    };
  
    const now = new Date();
  
    if (data.status === OrderStatus.PAID && !existingOrder.paidAt) {
      updateData.paidAt = now;
    }
  
    if (data.status === OrderStatus.CANCELLED && !existingOrder.cancelledAt) {
      updateData.cancelledAt = now;
    }
  
    if (data.status === OrderStatus.REFUNDED && !existingOrder.refundedAt) {
      updateData.refundedAt = now;
    }
  
    return prisma.order.update({
      where: {
        SessionId: data.sessionId,
      },
      data: updateData,
      select: {
        value: true,
        currency: true,
        SessionId: true,
        userEmail: true,
        userAddress: true,
        userPhoneNumber: true,
        status: true,
        paidAt: true,
        cancelledAt: true,
        refundedAt: true,
        updatedAt: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            itemId: true,
            item: {
              select: {
                image: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }