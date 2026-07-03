import Link from 'next/link'

import styles from './NavButton.module.css'

type NavButtonProps = {
    buttonName: string
    displayName: string
    onClick?: () => void
}

export default function NavButton({ buttonName, displayName, onClick, }: NavButtonProps) {
    const link = '/' + buttonName
    const label = displayName || buttonName

    return (
        <Link href={link} className={styles.button} onClick={onClick}>
            {label}
        </Link>
  )
}