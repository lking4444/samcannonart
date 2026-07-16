'use client'

import Image from 'next/image'
import styles from './CalendarPages.module.css'

const images = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    src: `/api/images/CalendarPages/image${index + 1}.jpg`,
    alt: `Calendar page ${index + 1}`,
}))

export default function CalendarPages() {
    return (
        <div className={styles.calendarPagesContainer}>
            <p className={styles.calendarPagesTitle}>Monthly pages</p>
            <section className={styles.calendarPages}>
                    {images.map((image) => (
                        <div key={image.id} className={styles.imageWrapper}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={800}
                            height={1000}
                            className={styles.image}
                        />
                        </div>
                    ))}
            </section>
        </div>
       
    )
}