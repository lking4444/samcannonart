import { DisplayOrder, formatDate, formatMoney, } from "@/lib/orders/orderDisplay";

import styles from '../OrderItem.module.css'

type OrderSummaryCardProps = {
    order: DisplayOrder;
    updatedAt: string;
    paidAt: string | null;
    cancelledAt: string | null;
    refundedAt: string | null;
};

export default function OrderSummaryCard({ order, updatedAt, paidAt, cancelledAt, refundedAt, }: OrderSummaryCardProps) {
    return (
        <section className={styles.card}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>

            <dl className={styles.descriptionList}>
                <div>
                    <dt className={styles.term}>Total Value</dt>
                    <dd className={styles.description}>
                        {formatMoney(order.value, order.currency)}
                    </dd>
                </div>

                <div>
                    <dt className={styles.term}>Currency</dt>
                    <dd className={styles.description}>{order.currency}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Created</dt>
                    <dd className={styles.description}>
                        {formatDate(order.createdAt)}
                    </dd>
                </div>

                <div>
                    <dt className={styles.term}>Last Updated</dt>
                    <dd className={styles.description}>{formatDate(updatedAt)}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Paid At</dt>
                    <dd className={styles.description}>{formatDate(paidAt)}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Cancelled At</dt>
                    <dd className={styles.description}>{formatDate(cancelledAt)}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Refunded At</dt>
                    <dd className={styles.description}>{formatDate(refundedAt)}</dd>
                </div>
            </dl>
        </section>
    );
}