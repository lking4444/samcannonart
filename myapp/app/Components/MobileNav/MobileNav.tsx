import Image from 'next/image'
import styles from './MobileNav.module.css'

import * as Dialog from "@radix-ui/react-dialog"
import PageButton from '../PageButton'
import NavButton from './NavButton'

type MobileNavProps = {
    open: boolean
    onClose: () => void
    onCartClick: () => void
  }

export default function MobileNav({open, onClose, onCartClick} : MobileNavProps){
    return(
        <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.navOverlay} />
                <Dialog.Content className={styles.navDrawer}>
                    <div className={styles.container}>
                        <span className={styles.logoContainer}>
                            <button onClick={onCartClick}>
                                <span className={styles.circle}>
                                    <Image   
                                        src="/icons/cart.svg"
                                        alt="Left"
                                        width={40}
                                        height={40}
                                        className={styles.card}
                                    />
                                </span>
                            </button>
                        </span>
                        <span className={styles.linkContainer}>
                            <NavButton buttonName='' displayName='Home'/>
                            <NavButton buttonName='Cards' displayName=''/>
                            <NavButton buttonName='Calendars' displayName=''/>
                            <NavButton buttonName='Originals' displayName=''/>
                            <NavButton buttonName='Prints' displayName=''/>
                            <NavButton buttonName='Gifts' displayName=''/>
                            <NavButton buttonName='NotePads' displayName=''/>
                            <NavButton buttonName='Slates' displayName=''/>
                        </span>  
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}