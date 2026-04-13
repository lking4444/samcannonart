import PageButton from "@/app/Components/PageButton";
import styles from './AdminHeader.module.css'

export default function AdminHeader()  {
    return (
        <div className={styles.headerContainer}>
            <span className={styles.pagesContainer}>
                <PageButton buttonName="Upload" prefix="Admin" />
                <PageButton buttonName="Orders" prefix="Admin" />
                <PageButton buttonName="Admin" icon="/icons/home.svg" />
            </span>
        </div>
    )
}