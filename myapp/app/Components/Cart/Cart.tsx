'use client'

import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from 'next/image'

import { useCartStore } from "@/app/Store/cartStore"
import Loading from "@/app/(Pages)/Components/Loading"
import { DbItem } from "@/app/Types/items"
import CartItemUI from "./CartItem/CartItem"

import { computeShipping } from "@/lib/shipping/calculateShipping"
import { computeDiscount } from "@/lib/discount/computeDiscount"
import { CheckoutStockError, goToCheckout, goToCheckoutInternational } from "@/lib/cart/checkout"
import { loadCartItemsByIds } from "@/lib/cart/loadCartItems"

import styles from './Cart.module.css'

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function Cart({ open, onClose }: CartDrawerProps) {
    const cartItems = useCartStore((s) => s.items)
    const clearCart = useCartStore((s) => s.clear)
    const removeItem = useCartStore((s) => s.removeItem)

    const cartIds = useMemo(() => cartItems.map((i) => i.itemId), [cartItems])
    const cartIdsKey = cartIds.join(",")

    const [items, setItems] = useState<DbItem[]>([])
    const [itemsError, setItemsError] = useState<string | null>(null)
    const [shippingCost, setShippingCost] = useState<number>(0)

    const [ukLoading, setUkLoading] = useState(false)
    const [internationalLoading, setInternationalLoading] = useState(false)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    const [outOfStockItems, setOutOfStockItems] = useState<{ itemId: number, requested: number, available: number }[]>([])
    const outOfStockMap = useMemo(() => {
        return new Map(outOfStockItems.map((item) => [item.itemId, item]))
    }, [outOfStockItems])


    useEffect(() => {
        if (!open) return

        if (cartIds.length === 0) {
            setItems([])
            setShippingCost(0)
            setItemsError(null)
            return
        }

        ;(async () => {
            try {
                setItemsError(null)

                const data = await loadCartItemsByIds(cartIds)

                setItems(data)
            } catch (error) {
                console.error(error)
                setItems([])
                setShippingCost(0)
                setItemsError("Unable to load your cart items.")
            }
        })()
    }, [open, cartIds.length, cartIdsKey])

    const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

    const itemsWithQuantity = useMemo(() => {
        return cartItems
            .map((ci) => {
                const item = itemMap.get(ci.itemId)
                if (!item) return null
                return { ...item, quantity: ci.quantity }
            })
            .filter(Boolean) as Array<DbItem & { quantity: number }>
    }, [cartItems, itemMap])

    useEffect(() => {
        setShippingCost(computeShipping(itemsWithQuantity))
    }, [itemsWithQuantity])

    const subtotal = itemsWithQuantity.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity
    }, 0)

    const discount = computeDiscount(itemsWithQuantity)

    const total = subtotal + shippingCost - discount

    const totalItemCount = itemsWithQuantity.reduce((sum, item) => {
        return sum + item.quantity
    }, 0)

    const deliveryText =
        totalItemCount >= 1 && shippingCost === 0
            ? "Free"
            : `£${Number(shippingCost).toFixed(2)}`

    async function handleUkCheckout() {
        try {
            setCheckoutError(null)
            setOutOfStockItems([])
            setUkLoading(true)

            await goToCheckout(cartItems)
        } catch (error) {
            console.error(error)

            if (error instanceof CheckoutStockError) {
                setOutOfStockItems(error.items)
                setCheckoutError("Some items in your cart are no longer available.")
            } else {
                setCheckoutError("Something went wrong. Please refresh the page and try again.")
            }

            setUkLoading(false)
        }
    }

    async function handleInternationalCheckout() {
        try {
            setCheckoutError(null)
            setOutOfStockItems([])
            setInternationalLoading(true)

            await goToCheckoutInternational(cartItems)
        } catch (error) {
            console.error(error)

            if (error instanceof CheckoutStockError) {
                setOutOfStockItems(error.items)
                setCheckoutError("Some items in your cart are no longer available.")
            } else {
                setCheckoutError("Something went wrong. Please refresh the page and try again.")
            }

            setInternationalLoading(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.cartOverlay} />
                <Dialog.Content className={styles.cartDrawer}>
                    <div className={styles.cartContent}>
                        <span className={styles.topBar}>
                            <button onClick={onClose} className={styles.iconButton}>
                                <span className={styles.circle}>
                                    <Image
                                        src="/api/images/Icons/cross.svg"
                                        alt="Close"
                                        width={24}
                                        height={24}
                                        className={styles.chevron}
                                    />
                                </span>
                            </button>
                            <span className={styles.cartHeader}>
                                                        <Dialog.Title className={styles.cartTitle}>
                                                            Cart
                                                        </Dialog.Title>
                            </span>
                            <button
                                onClick={() => {
                                    clearCart()
                                    setItems([])
                                    setShippingCost(0)
                                }}
                                className={styles.iconButton}
                            >
                                <span className={styles.circle}>
                                    <Image
                                        src="/api/images/Icons/trash.svg"
                                        alt="Clear cart"
                                        width={24}
                                        height={24}
                                        className={styles.chevron}
                                    />
                                </span>
                            </button>
                        </span>

                       

                        <div className={styles.itemContainer}>
                            {itemsError ? (
                                <div className={styles.cartError}>
                                    <p>Unable to load your cart items.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setItemsError(null)
                                            setItems([])
                                        }}
                                        className={styles.retryButton}
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : (
                                itemsWithQuantity.map((item) => {
                                    const stockIssue = outOfStockMap.get(item.id)

                                    return (
                                        <div
                                            key={item.id}
                                            className={`${styles.cartItemWrapper} ${
                                                stockIssue ? styles.cartItemUnavailable : ""
                                            }`}
                                        >
                                            <Link
                                                href={`/Item/${item.id}`}
                                                className={styles.link}
                                            >
                                                <CartItemUI
                                                    type={item.type}
                                                    imgSrc={item.image}
                                                    id={item.id}
                                                    itemName={item.name}
                                                    price={item.price.toString()}
                                                    quantity={item.quantity}
                                                />
                                            </Link>

                                            {stockIssue && (
                                                <div className={styles.stockWarning}>
                                                    {stockIssue.available > 0 ? (
                                                        <p>
                                                            Only {stockIssue.available} left. Please remove this item and add it again with a lower quantity.
                                                        </p>
                                                    ) : (
                                                        <p>This item is no longer available.</p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className={styles.removeUnavailableButton}
                                                        onClick={() => {
                                                            removeItem(item.id)
                                                            setOutOfStockItems((current) =>
                                                                current.filter((stockItem) => stockItem.itemId !== item.id)
                                                            )
                                                        }}
                                                    >
                                                        Remove item
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        <div className={styles.checkoutContainer}>
                            <span className={styles.priceInfo}>
                                <span className={styles.checkoutInfo}>
                                    <p>Subtotal</p>
                                    <p>£{Number(subtotal).toFixed(2)}</p>
                                </span>

                                <span className={styles.checkoutInfo}>
                                    <p>Discount</p>
                                    <p className={styles.checkoutInfoDiscount}>
                                        -£{Number(discount).toFixed(2)}
                                    </p>
                                </span>

                                <span className={styles.checkoutDeliveryInfo}>
                                    <p>Estimated Delivery</p>
                                    <p>{deliveryText}</p>
                                </span>

                                <hr className={styles.break} />

                                <span className={styles.checkoutInfoTotal}>
                                    <p>Total</p>
                                    <p>£{Number(total).toFixed(2)}</p>
                                </span>
                            </span>
                            {checkoutError && (
                                <div className={styles.checkoutError}>
                                    <p>{checkoutError}</p>
                                </div>
                            )}
                            <button
                                className={styles.checkoutButton}
                                onClick={handleUkCheckout}
                                disabled={ukLoading || internationalLoading || cartItems.length === 0 || !!itemsError}
                            >
                                {ukLoading ? <Loading small={true} /> : "Checkout"}
                            </button>

                            <button
                                className={styles.checkoutButtonInt}
                                onClick={handleInternationalCheckout}
                                disabled={ukLoading || internationalLoading || cartItems.length === 0 || !!itemsError}
                            >
                                {internationalLoading ? (
                                    <Loading small={true} />
                                ) : (
                                    "Non-UK Checkout"
                                )}
                            </button>

                            <p className={styles.internationalCheckoutDescription}>
                                For non-UK shipping locations, please use the international checkout.
                            </p>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}