import { useCartStore } from '@/app/Store/cartStore'
import { useUiStore } from '@/app/Store/uiStore'

import styles from './AddToBasket.module.css'

type AddToBasketProps = {
    itemId: number
  }
  
  export default function AddToBasket({ itemId }: AddToBasketProps) {
    const addItem = useCartStore((s) => s.addItem)
    const openCart = useUiStore((s) => s.openCart);

  
    return (
      <button
        className={styles.addToBasket}
        onClick={() => {
            addItem(itemId, 1)
            openCart()
          }}
      >
        Add To Basket
      </button>
    )
  }