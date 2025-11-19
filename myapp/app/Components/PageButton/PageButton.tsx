import Link from 'next/link'
import styles from './PageButton.module.css'

type PageButtonProps = {
    buttonName: string
}

export default function PageButton( {buttonName} : PageButtonProps) {

    const link = "/" + buttonName;

    return (
        <Link href={link}>
            <button className={styles.button}>
                {buttonName}
            </button>
        </Link>
     
    )
}