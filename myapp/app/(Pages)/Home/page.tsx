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

                <div className={styles.searchAnimation}>
                    <HomeSearch />
                </div>
            </div>
        </div >
        <div className={styles.popularHeader}>
            <p className={styles.popularText}>Popular Artwork</p>
        </div>
        <PopularContent/>
        <FeatureSection
            title="Cards"
            description="All of my greeting’s cards are digitally printed locally here in Dorset.
They are all blank inside and come with a plain white envelope. The are availiable in three sizes:
Square cards are 14cm by 14cm, Rectangular cards are 18cm by 13cm and Long Thin cards are 10cm by 20cm. 
I love turning my paintings into cards so I’m always adding new ones to those available. The thrill of
seeing your work as a card never gets old.
I also sell 9 different greetings card packs – 9 cards for the price of 8."
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
            description="All three of my calendars are digitally printed locally to me here in Dorset.
A4 (210mm by 297mm) and A5 (150mm by 215mm) calendars feature a full image on one page and a full page of dates
below. The dates page also includes the full moons of the year, the equinox dates and watermark images of
my favourite animals.
Birthday calendars are A4 in size and feature 12 different pictures to my annual calendars and have the painting and dates on 
the same page. These calendars are perfect for keeping annual dates –
birthdays, anniversaries and any un changing annual dates.
You buy it once and keep it forever."
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
            description="I tend to work in watercolours but do sometimes produce work in colour pencil.
Shapes and sizes vary.
My watercolour paper is Saunders Waterford Watercolour paper 300lb (640gsm).
I am inspired by the many beautiful things that live around me here in the Dorset countryside and do
my best to capture them."
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
            description="All of my prints are Giclee Printed by Iris Print, an award winning printing company, in Worcestershire. They are printed on 230gsm Matt
Art Paper.
They are posted out with a white mount (mat), backing board, inside cellophane and then a board
backed envelope. They are put between thick cardboard before cardboard corners are placed on the
packaging for extra protection.
My larger prints are posted out rolled up in tubes."
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
            description="Over the years I’ve tried to introduce lots of different items that can be given as a gift. 
            The range now includes hand painted pebbles, slates, wooden tiles, small original paintings on petal paper from Thailand and 
            mixed media pieces which include hand pressed flowers and leaves, found on my walks in the Dorset countryside. 
            All of my gifts are hand wrapped and can be posted to someone on your behalf. 
"
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
            href="/NotePads"
            side="right"
        />
    </div>
  )
}