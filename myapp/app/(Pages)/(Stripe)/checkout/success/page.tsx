import Stripe from "stripe"
import Image from "next/image"

import { getItemImageSrc } from "@/lib/images/imagepaths";
import { prisma } from "@/lib/prisma"

import styles from './success.module.css'
import { decrementPurchasedStock } from "@/lib/db/items";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import { createOrderFromCheckoutSession } from "@/lib/orders/createOrderFromCheckoutSession";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type Props = {
    searchParams: Promise<{ session_id?: string }>
}

export default async function Success({ searchParams }: Props){

    const sp = await searchParams
    const sessionId = sp.session_id

    if (!sessionId) return <p>Missing session_id</p>
  
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const orderTotal = session.amount_total 
    const customer = session.customer_details

    const reservationId = session.metadata?.reservationId
  
    if (!reservationId) return <p>Missing reservation metadata</p>

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
            items: {
                include: { item: true }, 
            },
        },
    })
    
    if (!reservation) return <p>Reservation not found</p>

    await createOrderFromCheckoutSession({
        sessionId,
        value: String(session.amount_total ?? 0),
        currency: session.currency ?? "gbp",
        userEmail: customer?.email ?? "",
        userPhoneNumber: customer?.phone ?? "",
        userAddress: [
            customer?.name,
            customer?.address?.line1,
            customer?.address?.line2,
            customer?.address?.city,
            customer?.address?.state,
            customer?.address?.postal_code,
            customer?.address?.country,
        ]
        .filter(Boolean)
        .join(", "),
        paidAt: new Date(),
        status: "PAID",
        items: reservation.items.map((ri:any) => ({
            itemId: ri.item.id,         
            quantity: ri.quantity ?? 1,  
            price: String(ri.item.price),
            type: ri.item.type
        })),
    });

    await decrementPurchasedStock(
        reservation.items.map((ri:any) => ({
            itemId: ri.item.id,
            quantity: ri.quantity ?? 1,
        }))
    );

    
    const ids = reservation.items.map((ri:any) => ri.item.id)

    const items = await prisma.item.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, image: true, price: true, dimensions: true, description: true, type: true },
    })

    return (
        <div className={styles.pageContainer}>
            <ClearCartOnSuccess />
            <h1 className={styles.thankYouHeader}>Thank you!</h1>
            <div className={styles.orderConfirmationContainer}>
                <div className={styles.halfPageContainer}>
                    <h1 className={styles.header}>Your order has been successfully placed</h1>
                    <div className={styles.emailInfo}>
                        <p className={styles.checkEmail}>Please check your email inbox for your order confirmation</p>
                        <p className={styles.checkEmail}>We have sent the order confirmation to {customer?.email}</p>
                    </div>
                
                    <hr className={styles.pageBreak}/>
        
                    <div className={styles.orderInfoWrapper}>
                        <p className={styles.header}>Shipment Details</p>
                        <p className={styles.address}>Shipment Address</p>
                        <p className={styles.smallHeader}>{customer?.name}</p>
                        <p className={styles.smallHeader}>{customer?.address?.line1}</p>
                        <p className={styles.smallHeader}>{customer?.address?.line2}</p>
                        <p className={styles.smallHeader}>{customer?.address?.city}</p>
                        <p className={styles.smallHeader}>{customer?.address?.state}</p>
                        <p className={styles.smallHeader}> {customer?.address?.postal_code}</p>
                        <p className={styles.smallHeader}>{customer?.address?.country}</p>
                    </div>
                </div>
                <div className={styles.halfPageContainer}>
                    <h1 className={styles.header}>Summary</h1>
                    {items.map((item) => (
                        <div key={item.id} className={styles.summaryContainer}>
                            <Image className={styles.image} src={getItemImageSrc(item.type, item.image)} width={100} height={100} alt={item.name}/>
                            <div className={styles.summaryInfoContainer}>
                            <p>{item.name}</p>
                            <p className={styles.summaryInfoGray}>{item.dimensions}</p>
                            <p className={styles.summaryInfoGray}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                    <div className={styles.priceInfo}>

                        <hr className={styles.pageBreak}/>

                        <div className={styles.total}>
                            <p>Total:</p>
                            <p>£{(orderTotal! / 100).toFixed(2)}</p>
                        </div>
                    </div>
                  
                </div>
            </div>
        </div>
        
      )
}