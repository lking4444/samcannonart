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
                            src={'/api/images/Icons/facebook.svg'}
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
                            src={'/api/images/Icons/instagram.svg'}
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
                            src={'/api/images/Icons/pinterest.svg'}
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
                            src={'/api/images/Icons/email.svg'}
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