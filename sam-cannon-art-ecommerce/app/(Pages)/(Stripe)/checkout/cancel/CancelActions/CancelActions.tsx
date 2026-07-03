"use client"
import Link from "next/link"

import { useUiStore } from "@/app/Store/uiStore"

import styles from "./CancelActions.module.css"

export default function CancelActions() {
    const openCart = useUiStore((s) => s.openCart)

    return (
        <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={openCart}>
                Return to checkout
            </button>

            <Link className={styles.secondaryButton} href="/">
                Continue shopping
            </Link>
        </div>
     )
}