'use client'

import * as Dialog from "@radix-ui/react-dialog"
import styles from './Cart.module.css'
import Image from 'next/image'
import { CartItem, useCartStore } from "@/app/Store/cartStore"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import CartItemUI from "./CartItem/CartItem"
import type { ItemType, Reservation } from "@/app/generated/prisma/client"
import Loading from "@/app/(Pages)/Components/Loading"

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

type DbItem = {
    id: number
    name: string
    image: string
    type: ItemType
    price: any
}

async function goToCheckout(total : number, cartItems : CartItem[]) {

    const itemids = cartItems.map((item => item.itemId))

    console.log("Creating reservation for itemIds:", itemids);

    const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
    })
    
    if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error ?? "Failed to reserve items")
    }

    const reservation : Reservation = await response.json()
    const reservationId = reservation.id as string

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({reservationId}),
    })

    const { url } = await res.json()
    window.location.href = url
  }

export default function Cart({ open, onClose }: CartDrawerProps) {
    const cartItems = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clear);

    const cartIds = useMemo(() => cartItems.map((i) => i.itemId), [cartItems]);

    const [items, setItems] = useState<DbItem[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return
        if (cartIds.length === 0) {
            setItems([])
            return
        }

        (async () => {
            const res = await fetch("/api/items/by-ids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: cartIds }),
            })
            const data = await res.json()
            setItems(data)
        })()
    }, [open, cartIds])

    const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

    const itemsWithQuantity = cartItems
        .map((ci) => {
        const item = itemMap.get(ci.itemId)
        if (!item) return null
        return { ...item, quantity: ci.quantity }
        })
        .filter(Boolean) as Array<DbItem & { quantity: number }>

    const subtotal = itemsWithQuantity.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity
    }, 0);

    const delivery = 2.0;

    const total = subtotal + delivery;

    return (
        <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.cartOverlay} />
                <Dialog.Content className={styles.cartDrawer}>
                    <div className={styles.cartContent}>
                        <span className={styles.topBar}>
                            <button onClick={onClose}>
                                <span className={styles.circle}>
                                    <Image   
                                        src="/icons/cross.svg"
                                        alt="Left"
                                        width={24}
                                        height={24}
                                        className={styles.chevron}
                                    />
                                </span>
                            </button>
                            <button onClick={clearCart}>
                                <span className={styles.circle}>
                                    <Image   
                                        src="/icons/trash.svg"
                                        alt="Left"
                                        width={24}
                                        height={24}
                                        className={styles.chevron}
                                    />
                                </span>
                            </button>
                        </span>
                        <span className={styles.cartHeader}>
                            <Dialog.Title className={styles.cartTitle}>My Cart</Dialog.Title>
                        </span>
                        <div className={styles.itemContainer}>
                            {itemsWithQuantity.map(item => (
                                <Link href={`/Item/${item.id}`} className={styles.link} key={item.id}>
                                     <CartItemUI
                                        key={item.id}
                                        type={item.type}
                                        imgSrc={item.image}
                                        id={item.id}
                                        itemName={item.name}
                                        price={item.price.toString()}
                                        quantity={item.quantity}
                                    />
                                </Link>
                            ))}
                        </div>
                        
                        <div className={styles.checkoutContainer}>
                            <span className={styles.priceInfo}>
                                <span className={styles.checkoutInfo}>
                                    <p>Subtotal</p>
                                    <p>£{Number(subtotal).toFixed(2)}</p>
                                </span>
                                <span className={styles.checkoutDeliveryInfo}>
                                    <p>Delivery</p>
                                    <p>£{Number(delivery).toFixed(2)}</p>
                                </span>
                                <hr className={styles.break}></hr>
                                <span className={styles.checkoutInfoTotal}>
                                    <p>Total</p>
                                    <p>£{Number(total).toFixed(2)}</p>
                                </span>
                            </span>
                            <button className={styles.checkoutButton} onClick={() => {setLoading(true); goToCheckout(total, cartItems);}}>
                                {loading ? <Loading /> : "Checkout"}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}