"use client";

import { useEffect, useState } from "react";

import { DisplayOrder, OrderStatus, } from "@/lib/orders/orderDisplay";
import { updateOrderStatus } from "@/lib/orders/updateOrderStatus";

import OrderCustomerCard from "./OrderCustomerCard";
import OrderItemsTable from "./OrderItemsTable";
import OrderStatusControls from "./OrderStatusControls";
import OrderSummaryCard from "./OrderSummaryCard";

import styles from "./OrderItem.module.css";

type OrderItemProps = {
    order: DisplayOrder;
    className?: string;
    onOrderUpdated?: (updatedOrder: DisplayOrder) => void;
};

export default function OrderItem({ order, className = "", onOrderUpdated, }: OrderItemProps) {
    const [originalStatus, setOriginalStatus] = useState<OrderStatus>(order.status);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

    const [localUpdatedAt, setLocalUpdatedAt] = useState<string>(order.updatedAt);
    const [localPaidAt, setLocalPaidAt] = useState<string | null>(order.paidAt ?? null);
    const [localCancelledAt, setLocalCancelledAt] = useState<string | null>( order.cancelledAt ?? null );
    const [localRefundedAt, setLocalRefundedAt] = useState<string | null>( order.refundedAt ?? null );

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const hasChanges = selectedStatus !== originalStatus;

    useEffect(() => {
        setOriginalStatus(order.status);
        setSelectedStatus(order.status);
        setLocalUpdatedAt(order.updatedAt);
        setLocalPaidAt(order.paidAt ?? null);
        setLocalCancelledAt(order.cancelledAt ?? null);
        setLocalRefundedAt(order.refundedAt ?? null);
        setMessage(null);
        setError(null);
    }, [order]);

    const resetChanges = () => {
        setSelectedStatus(originalStatus);
        setMessage(null);
        setError(null);
    };

    const saveChanges = async () => {
        if (!hasChanges) return;

        setIsSaving(true);
        setMessage(null);
        setError(null);

        try {
            const updatedOrder = await updateOrderStatus({
                sessionId: order.SessionId,
                status: selectedStatus,
                updatedAt: localUpdatedAt,
            });

            setOriginalStatus(updatedOrder.status);
            setSelectedStatus(updatedOrder.status);
            setLocalUpdatedAt(updatedOrder.updatedAt);
            setLocalPaidAt(updatedOrder.paidAt ?? null);
            setLocalCancelledAt(updatedOrder.cancelledAt ?? null);
            setLocalRefundedAt(updatedOrder.refundedAt ?? null);

            onOrderUpdated?.(updatedOrder);

            setMessage("Order status updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                ? err.message
                : "Something went wrong while saving."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`${styles.orderItem} ${className}`}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Order</h2>
                    <p className={styles.sessionText}>Session: {order.SessionId}</p>
                </div>

                <OrderStatusControls
                    selectedStatus={selectedStatus}
                    hasChanges={hasChanges}
                    isSaving={isSaving}
                    onStatusChange={setSelectedStatus}
                    onReset={resetChanges}
                    onSave={saveChanges}
                />
            </div>

            {(message || error) && (
                <div className={styles.feedbackWrapper}>
                    {message && <div className={styles.successMessage}>{message}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                </div>
            )}

            <div className={styles.detailsGrid}>
                <OrderCustomerCard order={order} />
                <OrderSummaryCard
                    order={order}
                    updatedAt={localUpdatedAt}
                    paidAt={localPaidAt}
                    cancelledAt={localCancelledAt}
                    refundedAt={localRefundedAt}
                />
            </div>

            <OrderItemsTable items={order.items} currency={order.currency} />
        </div>
    );
}