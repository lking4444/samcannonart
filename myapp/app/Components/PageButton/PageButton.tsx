import Link from 'next/link'
import styles from './PageButton.module.css'
import Image from 'next/image';

type PageButtonProps = {
    buttonName: string;
    icon?: string;
    prefix?: string;
}

export default function PageButton( {buttonName, icon, prefix} : PageButtonProps) {

    const link = "/" + buttonName;

    if (icon) {
        return (
            <Link href={link} className={styles.button}>
                <Image  
                    className={styles.icon} 
                    src={icon}
                    alt="Left"
                    width={24}
                    height={24}
                />
            </Link>
        )
    }else if (prefix) {
        return (
            <Link href={`${prefix}${link}`} className={styles.button}>
                    {buttonName}
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