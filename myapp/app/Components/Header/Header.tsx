import styles from './Header.module.css'
import PageButton from '../PageButton'
import Image from 'next/image'

type HeaderProps = {
    onCartClick: () => void
}


export default function Header({ onCartClick }: HeaderProps)  {

    return (
        <div className={styles.headerContainer}>
            <span className={styles.pagesContainer}>
            <PageButton buttonName='' icon='/icons/home.svg'></PageButton>
            <PageButton buttonName='Cards'></PageButton>
            <PageButton buttonName='Calendars'></PageButton>
            <PageButton buttonName='Originals'></PageButton>
            <PageButton buttonName='Prints'></PageButton>
            <PageButton buttonName='Gifts'></PageButton>
            <PageButton buttonName='NotePads'></PageButton>
            <PageButton buttonName='Slates'></PageButton>
            </span>
            <span className={styles.logoContainer}>
                <button onClick={onCartClick}>
                    <span className={styles.circle}>
                        <Image   
                            src="/icons/cart.svg"
                            alt="Left"
                            width={24}
                            height={24}
                            className={styles.card}
                        />
                    </span>
                </button>
            </span>
        </div>
    )
}

