'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

import AddToBasket from '../AddToBasket';
import BuyNow from './BuyNow';
import SuggestedContent from './SuggestedContent';

import { getImageKey, getItemImageSrc } from '@/lib/images/imagepaths';
import { ClientItem } from './types';

import styles from './ItemDetails.module.css'
import Loading from '../Loading';
import CalendarPages from '../CalendarPages';

type ItemDetailsProps = {
    item: ClientItem
}

export default function ItemDetails({ item }: ItemDetailsProps) {
    const router = useRouter();
    const imagePath = getItemImageSrc(item.type, item.image);

    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={styles.pageContentContainer}>
            <div className={styles.itemComponentWrapper}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={styles.backButton}
                    aria-label="Go back"
                >
                    <Image
                        src={"/api/images/Icons/back.svg"}
                        width={25}
                        height={25}
                        className={styles.backIcon}
                        alt="Back"
                    />
                </button>

                <div className={styles.detailContainer}>
                    <div className={styles.itemComponentContainer}>

                    <div className={`${styles.imageWrapper} ${!imageLoaded ? styles.imageWrapperLoading : ''}`} >
                        {!imageLoaded && (
                            <div className={styles.imageLoading}>
                                <div className={styles.loadingInner}>
                                    <Loading />
                                </div>
                            </div>
                        )}

                        <Image
                            src={`${imagePath}`}
                            width={400}
                            height={400}
                            alt={item.name}
                            className={styles.itemImage}
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                opacity: imageLoaded ? 1 : 0,
                            }}
                        />
                    </div>

                        <div className={styles.descriptionContainerMobile}>
                            <div className={styles.descriptionContainer}>
                                <h1 className={styles.itemName}>{item.name}</h1>
                                <p className={styles.itemPrice}>
                                    £{Number(item.price).toFixed(2)}
                                </p>
                                <hr className={styles.divider} />
                                <p className={styles.itemDescription}>{item.description}</p>
                                <p className={styles.itemSize}>{item.dimensions}</p>
                                <hr className={styles.divider} />
                                <div className={styles.purchaseButtons}>
                                    <BuyNow item={item} />
                                    <AddToBasket itemId={item.id} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {item.type == 'CALENDAR' && (<CalendarPages/>)}
            <SuggestedContent id={String(item.id)} />
        </div>
    )
}