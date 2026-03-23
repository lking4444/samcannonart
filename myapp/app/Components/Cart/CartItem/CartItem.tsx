import Image from "next/image";
import styles from "./CartItem.module.css"
import { useCartStore } from "@/app/Store/cartStore"


type CartItemProps = {
    itemName: string;
    id: number;
    imgSrc: string; 
    price: string;
    quantity: number;
}

export default function CartItemUI({itemName, id, imgSrc, price, quantity} : CartItemProps){
    const addItem = useCartStore((s) => s.addItem)
    const setQuantity = useCartStore((s) => s.setQuantity)
    const removeItem = useCartStore((s) => s.removeItem)

    return (
    <div>
        <span className={styles.itemContainer}>
            <span className={styles.item}>
                <Image  className={styles.image}src={`/${imgSrc}`} width={100} height={100} alt={"image"}/>
                <span className={styles.infoContainer}>
                    <p className={styles.name}>{itemName}</p>
                    <p><span className={styles.price}>£{price}</span><span className={styles.quantity}> x{quantity}</span></p>
                </span>
            </span>
            <span >
                <div className={styles.adjustStock}>
                    <div className={styles.plusContainer} onClick={() => addItem(id, 1)}>
                        <Image className={styles.plus}  src="/icons/plus.svg" alt="Left"width={24} height={24} />
                    </div>
                    <div className={styles.minusContainer} onClick={() => {
                        if (quantity <= 1) {
                            removeItem(id)
                        } else {
                            setQuantity(id, quantity - 1)
                        }
                    }}>
                        <Image className={styles.minus} src="/icons/minus.svg" alt="Left"width={24} height={24} />
                    </div>
                </div>
            </span>
        </span>
    </div>
    );
}