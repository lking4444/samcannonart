import Image from 'next/image'
import styles from './SocialLinks.module.css'
import Link from 'next/link'

export default function SocialLinks(){
    return (
        <div className={styles.socialLinksContainer}>
            <div className={styles.linksContainer}>
                <span className={styles.circle}>
                    <Link href={'/'} className={styles.button}>
                        <Image  
                            className={styles.icon} 
                            src={'/icons/facebook.svg'}
                            alt="Left"
                            width={24}
                            height={24}
                        />
                    </Link>
                </span>
                <span className={styles.circle}>
                    <Link href={'/'} className={styles.button}>
                        <Image  
                            className={styles.icon} 
                            src={'/icons/instagram.svg'}
                            alt="Left"
                            width={24}
                            height={24}
                        />
                    </Link>
                </span>
                <span className={styles.circle}>
                    <Link href={'/'} className={styles.button}>
                        <Image  
                            className={styles.icon} 
                            src={'/icons/pinterest.svg'}
                            alt="Left"
                            width={24}
                            height={24}
                        />
                    </Link>
                </span>
                <span className={styles.circle}>
                    <Link href={'/'} className={styles.button}>
                        <Image  
                            className={styles.icon} 
                            src={'/icons/email.svg'}
                            alt="Left"
                            width={24}
                            height={24}
                        />
                    </Link>
                </span>
            </div>
        </div>
    )
}