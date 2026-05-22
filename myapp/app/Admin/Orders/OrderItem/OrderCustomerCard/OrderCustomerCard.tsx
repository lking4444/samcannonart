import { DisplayOrder } from "@/lib/orders/orderDisplay";

import styles from '../OrderItem.module.css'

type OrderCustomerCardProps = {
    order: DisplayOrder;
};

export default function OrderCustomerCard({ order }: OrderCustomerCardProps) {
    return (
        <section className={styles.card}>
            <h3 className={styles.sectionTitle}>Customer</h3>

            <dl className={styles.descriptionList}>
                <div>
                    <dt className={styles.term}>Email</dt>
                    <dd className={styles.description}>{order.userEmail}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Phone</dt>
                    <dd className={styles.description}>{order.userPhoneNumber}</dd>
                </div>

                <div>
                    <dt className={styles.term}>Address</dt>
                    <dd className={`${styles.description} ${styles.address}`}>
                        {order.userAddress}
                    </dd>
                </div>
            </dl>
        </section>
    );
}