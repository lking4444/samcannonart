import { getItemImageSrc } from "@/lib/images/imagepaths";
import { DisplayOrder, formatMoney, } from "@/lib/orders/orderDisplay";

import styles from '../OrderItem.module.css'

type OrderItemsTableProps = {
    items: DisplayOrder["items"];
    currency: DisplayOrder["currency"];
};

export default function OrderItemsTable({ items, currency, }: OrderItemsTableProps) {
    return (
        <section className={styles.itemsSection}>
            <h3 className={styles.sectionTitle}>Items</h3>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.tableHeaderCell}>Item</th>
                            <th className={styles.tableHeaderCell}>Quantity</th>
                            <th className={styles.tableHeaderCell}>Unit Price</th>
                            <th className={styles.tableHeaderCell}>Line Total</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tableBody}>
                        {items.map((item, index) => {
                            const lineTotal = Number(item.unitPrice) * item.quantity;

                            return (
                                <tr key={`${item.itemId}-${index}`}>
                                    <td className={`${styles.tableCell} ${styles.itemCell}`}>
                                        <div className={styles.itemInfo}>
                                            {item.item?.imageUrl && item.item?.type ? (
                                                <img
                                                    src={getItemImageSrc(
                                                        item.item.type,
                                                        item.item.imageUrl
                                                    )}
                                                    alt={item.item?.name || "Order item"}
                                                    className={styles.itemImage}
                                                />
                                            ) : (
                                                <div className={styles.noImage}>No image</div>
                                            )}

                                            <div>
                                                <div className={styles.itemName}>
                                                    {item.item?.name || `Item ${item.itemId}`}
                                                </div>

                                                {item.item?.description && (
                                                    <div className={styles.itemDescription}>
                                                        {item.item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className={styles.tableCellMuted}>{item.quantity}</td>

                                    <td className={styles.tableCellMuted}>
                                        {formatMoney(item.unitPrice, currency)}
                                    </td>

                                    <td className={styles.tableCellStrong}>
                                        {formatMoney(String(lineTotal), currency)}
                                    </td>
                                </tr>
                            );
                        })}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className={styles.emptyCell}>
                                    No items found for this order.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}