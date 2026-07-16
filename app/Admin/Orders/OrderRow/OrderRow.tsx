"use client";
import { DisplayOrder, formatDate } from "@/lib/orders/orderDisplay";

import styles from './OrderRow.module.css'

type OrderRowProps = {
    order: DisplayOrder;
    isSelected?: boolean;
    onClick: () => void;
};

const STATUS_STYLES: Record<DisplayOrder["status"], string> = {
    PENDING: styles.statusPending,
    PAID: styles.statusPaid,
    SHIPPED: styles.statusShipped,
    COMPLETED: styles.statusCompleted,
    CANCELLED: styles.statusCancelled,
    REFUNDED: styles.statusRefunded,
};

export default function OrderRow({ order, isSelected = false, onClick, }: OrderRowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.orderRow} ${
                isSelected ? styles.orderRowSelected : styles.orderRowDefault
            }`}
        >
            <div className={styles.grid}>
                <div className={styles.column}>
                    <p className={styles.label}>Email</p>
                    <p className={styles.email}>{order.userEmail}</p>
                </div>

                <div className={styles.column}>
                    <p className={styles.label}>Address</p>
                    <p className={styles.address}>
                        {order.userAddress.replace(/\n/g, ", ")}
                    </p>
                </div>

                <div className={styles.column}>
                    <p className={styles.label}>Date</p>
                    <p className={styles.value}>{formatDate(order.createdAt)}</p>
                </div>

                <div className={styles.column}>
                    <p className={styles.label}>Items</p>
                    <p className={styles.value}>{order.items.length}</p>
                </div>

                <div className={styles.column}>
                    <p className={styles.label}>Status</p>
                    <div className={styles.statusWrapper}>
                        <span className={`${styles.status} ${STATUS_STYLES[order.status]}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}