'use client'

import FeatureSection from './FeatureSection/FeatureSection'
import PopularContent from './PopularContent'
import HomeSearch from './HomeSearch'

import styles from './Home.module.css'

export default function HomePage() {

  return (
    <div>
        <div className={styles.siteBackground}>
            <div className={styles.infoContainer}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.homeTitle}>
                        Sam Cannon <span className={styles.homeTitleColour}>Art</span>
                    </h1>
                </div>
                <p className={styles.artistDescription}>
                    I’m an artist living in Dorset, England. I work in watercolours,
                    gouache, colour pencils and graphite pencil on board, paper,
                    slates and stone.
                </p>
                <HomeSearch></HomeSearch>
            </div>
        </div >
        <div className={styles.popularHeader}>
            <p className={styles.popularText}>Popular Artwork</p>
        </div>
        <PopularContent/>
        <FeatureSection
            title="Cards"
            description="Each stone is individually hand painted in my Dorset studio using acrylic paints and sealed for durability. Inspired by the coastline, wildlife, and quiet moments in nature, no two pieces are ever the same. These stones are designed as small, tactile artworks — perfect as keepsakes, gifts, or decorative pieces that bring a little calm and character into everyday spaces."
            images={[
                "/api/images/HomePage/Cards/image1.jpg",
                "/api/images/HomePage/Cards/image2.jpg",
                "/api/images/HomePage/Cards/image3.jpg",
            ]}
            href="/Cards"
            side="left"
        />
        <FeatureSection
            title="Calendars"
            description="My illustrated calendars combine original artwork with practical, thoughtful design. Each month features a unique illustration inspired by seasonal changes, colour, and everyday beauty. Printed on high-quality paper, they’re made to be both useful and enjoyable to live with — whether on your wall, desk, or given as a meaningful gift."
            images={[
                "/api/images/HomePage/Calendars/image1.jpg",
                "/api/images/HomePage/Calendars/image2.jpg",
                "/api/images/HomePage/Calendars/image3.jpg",
            ]}
            href="/Calendars"
            side="right"
        />
        <FeatureSection
            title="Originals"
            description="These are one-of-a-kind original artworks created by hand in my studio. Each piece is made slowly and intuitively, with attention to colour, texture, and small details that don’t always translate in reproduction. Originals are for those who want to live with a single, unrepeatable piece of work and build a personal connection with it."
            images={[
                "/api/images/HomePage/Originals/image1.jpg",
                "/api/images/HomePage/Originals/image2.jpg",
                "/api/images/HomePage/Originals/image3.jpg",
            ]}
            href="/Originals"
            side="left"
        />
        <FeatureSection
            title="Prints"
            description="My art prints are carefully reproduced from original works to preserve the character and feeling of the hand-painted piece. Printed on quality paper with a soft, natural finish, they’re designed to be easy to frame and live with — an accessible way to bring original artwork into your space."
            images={[
                "/api/images/HomePage/Prints/image1.jpg",
                "/api/images/HomePage/Prints/image2.jpg",
                "/api/images/HomePage/Prints/image3.jpg",
            ]}
            href="/Prints"
            side="right"
        />
        <FeatureSection
            title="Gifts"
            description="This collection brings together small, thoughtful pieces designed to be given and cherished. From painted objects to illustrated items, each gift is made with care and intention — ideal for birthdays, thank-yous, or simply letting someone know you’re thinking of them."
            images={[
                "/api/images/HomePage/Gifts/image1.jpg",
                "/api/images/HomePage/Gifts/image2.jpg",
                "/api/images/HomePage/Gifts/image3.jpg",
            ]}
            href="/Gifts"
            side="left"
        />
        <FeatureSection
            title="Notepads"
            description="My illustrated notepads pair practical everyday use with original artwork. Each design features gentle illustrations intended to make writing lists, notes, or ideas feel a little more enjoyable. Printed on smooth paper and designed for regular use, they’re both functional and pleasing to keep close by."
            images={[
                "/api/images/HomePage/Notepads/image1.jpg",
                "/api/images/HomePage/Notepads/image2.jpg",
                "/api/images/HomePage/Notepads/image3.jpg",
            ]}
            href="/Notepads"
            side="right"
        />
    </div>
  )
}