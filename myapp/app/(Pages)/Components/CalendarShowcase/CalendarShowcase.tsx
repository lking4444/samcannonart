import Image from 'next/image'

import styles from './CalendarShowcase.module.css'

export default function CalendarShowcase(){

    return(
        <div className={styles.showcaseContainer}>
            <div className={styles.groupedImages}>
                <Image
                    className={styles.shortImage}
                    src={'/api/images/CalendarShowcase/image1.jpg'}
                    width={250}
                    height={250}
                    alt={'Open Calendar'}
                />
                 <Image
                    className={styles.shortImage}
                    src={'/api/images/CalendarShowcase/image2.jpg'}
                    width={250}
                    height={250}
                    alt={'Open Calendar'}
                />
            </div>
            <div className={styles.groupedImages}>
                <img
                    className={styles.shortImage}
                    src={'/api/images/CalendarShowcase/image3.jpg'}
                    width={250}
                    height={250}
                    alt={'Open Calendar'}
                />
                 <Image
                    className={styles.shortImage}
                    src={'/api/images/CalendarShowcase/image2.jpg'}
                    width={250}
                    height={250}
                    alt={'Open Calendar'}
                />
            </div>
        </div>
    )
}