"use client"

import Image from "next/image"
import styles from "./CartItem.module.css"
import { ItemType } from "@prisma/client"
import { getItemImageSrc } from "@/lib/images/imagepaths"
import { useCartActions } from "@/app/Hooks/useCartActions"

type CartItemProps = {
  itemName: string
  id: number
  type: ItemType
  imgSrc: string
  price: string
  quantity: number
}

export default function CartItemUI({ itemName, id, imgSrc, price, quantity, type, }: CartItemProps) {
    const { increaseQuantity, decreaseQuantity, isLoading } = useCartActions()

    async function handleIncreaseQuantity() {
        const result = await increaseQuantity(id, 1)

        if (!result.ok) {
        alert(result.message)
        }
    }

    function handleDecreaseQuantity() {
        decreaseQuantity(id, quantity)
    }

    return (
        <div>
        <span className={styles.itemContainer}>
            <span className={styles.item}>
            <Image
                className={styles.image}
                src={getItemImageSrc(type, imgSrc)}
                width={100}
                height={100}
                alt={itemName}
            />

            <span className={styles.infoContainer}>
                <p className={styles.name}>{itemName}</p>
                <p>
                <span className={styles.price}>
                    £{Number(price).toFixed(2)}
                </span>
                <span className={styles.quantity}> x {quantity}</span>
                </p>
            </span>
            </span>

            <span>
            <div className={styles.adjustStock}>
            <div
                className={styles.plusContainer} 
                onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleIncreaseQuantity(); 
                }}
            >
                <Image
                    className={styles.plus}
                    src="/icons/plus.svg"
                    alt="Increase quantity"
                    width={24}
                    height={24}
                />
            </div>

            <div
                className={styles.minusContainer}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDecreaseQuantity();
                }}
            >
                <Image
                    className={styles.minus}
                    src="/icons/minus.svg"
                    alt="Decrease quantity"
                    width={24}
                    height={24}
                />
            </div>
            </div>
            </span>
        </span>
        </div>
    )   
}