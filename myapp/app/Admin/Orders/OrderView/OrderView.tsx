"use client";

import { useEffect, useState } from "react";

import OrderRow from "../OrderRow";
import OrderItem from "../OrderItem/OrderItem";

import { DisplayOrder, getOrders } from "@/lib/orders/orderDisplay";

import styles from './OrderView.module.css'

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

                const data = await getOrders();

                if (!isMounted) return;

                setOrders(data);

                if (data.length > 0) {
                    setSelectedSessionId((current) => current || data[0].SessionId);
                }
            } catch (err) {
                if (!isMounted) return;

                setError(err instanceof Error ? err.message : "Something went wrong.");
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

    const selectedOrder = orders.find((order) => order.SessionId === selectedSessionId) ?? orders[0];

    return (
        <div className={styles.orderView}>
            <section className={styles.sidebar}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Orders</h1>
                    <p className={styles.subtitle}>Select an order to view full details.</p>
                </div>

                {isLoading && (
                    <div className={styles.loadingMessage}>Loading orders...</div>
                )}

                {error && !isLoading && (
                    <div className={styles.errorMessage}>{error}</div>
                )}

                {!isLoading && !error && (
                    <div className={styles.orderList}>
                        {orders.map((order) => (
                            <OrderRow
                                key={order.SessionId}
                                order={order}
                                isSelected={order.SessionId === selectedSessionId}
                                onClick={() => setSelectedSessionId(order.SessionId)}
                            />
                        ))}

                        {orders.length === 0 && (
                            <div className={styles.emptyMessage}>No orders found.</div>
                        )}
                    </div>
                )}
            </section>

            <section className={styles.detailsPanel}>
                {selectedOrder ? (
                    <OrderItem
                        order={selectedOrder}
                        onOrderUpdated={(updatedOrder) => {
                        setOrders((currentOrders) =>
                            currentOrders.map((order) =>
                            order.SessionId === updatedOrder.SessionId
                                ? updatedOrder
                                : order
                            )
                        );
                        }}
                    />
                ) : (
                    <div className={styles.emptyMessage}>No order selected.</div>
                )}
            </section>
        </div>
    );
}