import { ClientItem } from '../types'
import { goToCheckout } from '@/lib/checkout';

import styles from './BuyNow.module.css'

type BuyNowProps = {
    item: ClientItem
}

export default function BuyNow({ item }: BuyNowProps) {
    return (
      <button
        className={styles.buyNow}
        onClick={() => goToCheckout([{ itemId: item.id, quantity: 1 }])}
      >
        Buy Now
      </button>
    );
  }