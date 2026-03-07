import styles from "./cancel.module.css"
import CancelActions from "./CancelActions"

type Props = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function Cancel({ searchParams }: Props) {
    const sp = await searchParams
    const sessionId = sp.session_id

    return (
        <div className={styles.pageContainer}>
        <h1 className={styles.header}>Checkout cancelled</h1>

        <div className={styles.cancelContainer}>
            <div className={styles.halfPageContainer}>
            <p className={styles.sectionHeader}>
                Your payment wasn’t completed, so your order hasn’t been placed.
            </p>

            <p className={styles.smallHeader}>
                If you still want to purchase your items, you can return to checkout
                and try again.
            </p>

            {sessionId ? (
                <p className={styles.smallHeader}>Session: {sessionId}</p>
            ) : null}

            <hr className={styles.pageBreak} />

            <CancelActions/>
            </div>

            <div className={styles.halfPageContainer}>
            <h2 className={styles.sectionHeader}>Need help?</h2>

            <p className={styles.smallHeader}>
                If you saw an error or have a question about payment, contact support
                and we’ll help you sort it.
            </p>

            <div className={styles.helpBox}>
                <p className={styles.helpTitle}>Support</p>
                <p className={styles.smallHeader}>Email: samantha_cannon@hotmail.com</p>
                <p className={styles.smallHeader}>Include your email and what happened.</p>
            </div>
            </div>
        </div>
        </div>
    )
}