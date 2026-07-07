import styles from './Header.module.css'
import PageButton from '../PageButton'
import Image from 'next/image'
import MobileNav from '../MobileNav'

type HeaderProps = {
    onCartClick: () => void
    onNavClick: () => void
}

export default function Header({ onCartClick, onNavClick }: HeaderProps) {
    return (
        <header className={styles.headerContainer}>
            <nav className={styles.pagesContainer} aria-label="Main navigation">
                <PageButton buttonName="" icon="/api/images/Icons/home.svg" label="Home" />
                <PageButton buttonName="Cards" />
                <PageButton buttonName="Calendars" />
                <PageButton buttonName="Originals" />
                <PageButton buttonName="Prints" />
                <PageButton buttonName="Gifts" />
                <PageButton buttonName="NotePads" />
            </nav>

            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <button
                        type="button"
                        onClick={onCartClick}
                        className={styles.iconButton}
                        aria-label="Open cart"
                    >
                        <span className={styles.circle}>
                            <Image
                                src="/api/images/Icons/cart.svg"
                                alt=""
                                width={24}
                                height={24}
                                className={styles.card}
                            />
                        </span>
                    </button>
                </div>

                <div className={styles.navContainer}>
                    <button
                        type="button"
                        onClick={onNavClick}
                        className={styles.iconButton}
                        aria-label="Open navigation menu"
                    >
                        <span className={styles.circle}>
                            <Image
                                src="/api/images/Icons/nav.svg"
                                alt=""
                                width={24}
                                height={24}
                                className={styles.card}
                            />
                        </span>
                    </button>
                </div>
            </div>
        </header>
    )
}