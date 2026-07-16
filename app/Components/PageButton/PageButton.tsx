import Link from 'next/link'
import styles from './PageButton.module.css'
import Image from 'next/image'

type PageButtonProps = {
    buttonName: string
    icon?: string
    prefix?: string
    label?: string
}

export default function PageButton({ buttonName, icon, prefix, label }: PageButtonProps) {
    const href = prefix
        ? `/${prefix}/${buttonName}`
        : buttonName
            ? `/${buttonName}`
            : '/'

    const accessibleLabel = label ?? buttonName

    return (
        <Link
            href={href}
            className={styles.button}
            aria-label={icon ? accessibleLabel : undefined}
        >
            {icon ? (
                <Image
                    className={styles.icon}
                    src={icon}
                    alt=""
                    width={24}
                    height={24}
                />
            ) : (
                buttonName
            )}
        </Link>
    )
}