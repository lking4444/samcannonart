import Image from 'next/image'
import styles from './MobileNav.module.css'

import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import NavButton from './NavButton'

type MobileNavProps = {
  open: boolean
  onClose: () => void
  onCartClick: () => void
}

export default function MobileNav({ open, onClose, onCartClick }: MobileNavProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.navOverlay} />

        <Dialog.Content className={styles.navDrawer}>
          <VisuallyHidden>
            <Dialog.Title>Mobile navigation menu</Dialog.Title>
          </VisuallyHidden>

          <div className={styles.container}>
            <span className={styles.logoContainer}>
              <button onClick={onCartClick} className={styles.cartButton} aria-label="Open cart">
                <span className={styles.circle}>
                  <Image
                    src="/api/images/Icons/cart.svg"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.card}
                  />
                </span>
              </button>
            </span>

            <span className={styles.linkContainer}>
              <NavButton buttonName="" displayName="Home" onClick={onClose} />
              <NavButton buttonName="Cards" displayName="" onClick={onClose} />
              <NavButton buttonName="Calendars" displayName="" onClick={onClose} />
              <NavButton buttonName="Originals" displayName="" onClick={onClose} />
              <NavButton buttonName="Prints" displayName="" onClick={onClose} />
              <NavButton buttonName="Gifts" displayName="" onClick={onClose} />
              <NavButton buttonName="NotePads" displayName="" onClick={onClose} />
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}