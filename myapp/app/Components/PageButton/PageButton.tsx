import Link from 'next/link'
import styles from './PageButton.module.css'
import Image from 'next/image'

type PageButtonProps = {
    buttonName: string
    icon?: string
    prefix?: string
}

export default function PageButton({ buttonName, icon, prefix }: PageButtonProps) {
    const href = prefix
        ? `/${prefix}/${buttonName}`
        : `/${buttonName}`

    return (
        <Link href={href} className={styles.button}>
            {icon ? (
                <Image
                    className={styles.icon}
                    src={icon}
                    alt={buttonName}
                    width={24}
                    height={24}
                />
            ) : (
                buttonName
            )}
        </Link>
    )
}