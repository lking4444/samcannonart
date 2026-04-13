"use client";

import { useEffect, useState } from "react";
import OrderRow from "../OrderRow";
import OrderItem from "../OrderItem/OrderItem";
import type { DisplayOrder } from "@/lib/orders";

export default function OrderView() {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        setIsLoading(true);
        setError(null);

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

        const data: DisplayOrder[] = await response.json();

        if (!isMounted) return;

        setOrders(data);

        if (data.length > 0) {
          setSelectedSessionId((current) => current || data[0].SessionId);
        }
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedOrder =
    orders.find((order) => order.SessionId === selectedSessionId) ?? orders[0];

  return (
    <div className="grid h-[80vh] gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <section className="min-h-0 overflow-y-auto pr-2">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            Select an order to view full details.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
            Loading orders...
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderRow
                key={order.SessionId}
                order={order}
                isSelected={order.SessionId === selectedSessionId}
                onClick={() => setSelectedSessionId(order.SessionId)}
              />
            ))}

            {orders.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
                No orders found.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="min-h-0 overflow-y-auto pr-2">
        {selectedOrder ? (
          <OrderItem
            order={selectedOrder}
            onOrderUpdated={(updatedOrder) => {
              setOrders((currentOrders) =>
                currentOrders.map((order) =>
                  order.SessionId === updatedOrder.SessionId ? updatedOrder : order
                )
              );
            }}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
            No order selected.
          </div>
        )}
      </section>
    </div>
  );
}