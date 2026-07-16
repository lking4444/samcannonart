import { ORDER_STATUSES, OrderStatus, } from "@/lib/orders/orderDisplay";

import styles from '../OrderItem.module.css'

type OrderStatusControlsProps = {
    selectedStatus: OrderStatus;
    hasChanges: boolean;
    isSaving: boolean;
    onStatusChange: (status: OrderStatus) => void;
    onReset: () => void;
    onSave: () => void;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
    PENDING: styles.statusPending,
    PAID: styles.statusPaid,
    SHIPPED: styles.statusShipped,
    COMPLETED: styles.statusCompleted,
    CANCELLED: styles.statusCancelled,
    REFUNDED: styles.statusRefunded,
};

export default function OrderStatusControls({ selectedStatus, hasChanges, isSaving, onStatusChange, onReset, onSave, }: OrderStatusControlsProps) {
    const currentStatusClasses = STATUS_STYLES[selectedStatus];

    return (
        <div className={styles.statusPanel}>
            <span className={styles.statusLabel}>Status</span>

            <div className={styles.statusControls}>
                <span className={`${styles.statusBadge} ${currentStatusClasses}`}>
                    {selectedStatus}
                </span>

                <select
                    value={selectedStatus}
                    onChange={(event) =>
                    onStatusChange(event.target.value as OrderStatus)
                    }
                    className={`${styles.statusSelect} ${currentStatusClasses}`}
                >
                    {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                    ))}
                </select>
            </div>

            <div className={styles.actionRow}>
                <button
                    type="button"
                    onClick={onReset}
                    disabled={!hasChanges || isSaving}
                    className={styles.resetButton}
                >
                    Reset
                </button>

                <button
                    type="button"
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                    className={styles.saveButton}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}