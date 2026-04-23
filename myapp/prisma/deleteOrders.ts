import { prisma } from "../lib/prisma";

async function deleteAllOrdersAndOrderItems() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const deletedOrderItems = await tx.orderItem.deleteMany({});
      const deletedOrders = await tx.order.deleteMany({});

      return {
        deletedOrderItems: deletedOrderItems.count,
        deletedOrders: deletedOrders.count,
      };
    });

    console.log("Delete complete:", result);
  } catch (error) {
    console.error("Failed to delete orders and order items:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllOrdersAndOrderItems();