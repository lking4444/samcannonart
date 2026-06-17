import InternationalCheckoutClient from "./InternationalCheckoutClient"

export default async function InternationalCheckoutPage({ params, }: {params: Promise<{ reservationId: string }> }) {
    const { reservationId } = await params

    return <InternationalCheckoutClient reservationId={reservationId} />
}