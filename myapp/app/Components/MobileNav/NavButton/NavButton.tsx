import Link from 'next/link'
import styles from './NavButton.module.css'

type NavButtonProps = {
    buttonName: string,
    displayName: string
}

export default function NavButton( {buttonName, displayName} : NavButtonProps) {

    const link = "/" + buttonName;

    if (displayName != '') {
        return (
            <Link href={link} className={styles.button}>
                {displayName}
            </Link>
        )
    } else {
        return (
            <Link href={link} className={styles.button}>
                    {buttonName}
            </Link>
        )
    }
}