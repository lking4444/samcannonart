
import { getAllOrders } from '@/lib/db/order';
import QuickBooksExport from './QuickBooksExport';

export default async function OrdersPage() {
  const orders = await getAllOrders();

  const exportOrders = orders.map((order) => ({
    value: order.value.toNumber(),
    currency: order.currency,
    status: order.status,
    paidAt: order.paidAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
  }));

  return (
    <main>
      <QuickBooksExport orders={exportOrders} />
    </main>
  );
}