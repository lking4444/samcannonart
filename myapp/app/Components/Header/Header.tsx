import styles from './Header.module.css'
import PageButton from '../PageButton'

export default function Header() {

    return (
        <div className={styles.headerContainer}>
            <span className={styles.logoContainer}>
                <span className={styles.circlePlaceholder}></span>
            </span>
            <span className={styles.pagesContainer}>
            <PageButton buttonName='Cards'></PageButton>
            <PageButton buttonName='Calendars'></PageButton>
            <PageButton buttonName='Originals'></PageButton>
            <PageButton buttonName='Prints'></PageButton>
            <PageButton buttonName='Gifts'></PageButton>
            </span>
        </div>
    )
}

