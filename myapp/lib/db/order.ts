
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