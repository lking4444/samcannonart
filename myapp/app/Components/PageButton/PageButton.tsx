import Link from 'next/link'
import styles from './PageButton.module.css'

type PageButtonProps = {
    buttonName: string
}

export default function PageButton( {buttonName} : PageButtonProps) {

    const link = "/" + buttonName;

    return (
        <Link href={link} className={styles.button}>
                {buttonName}
        </Link>
    )
}