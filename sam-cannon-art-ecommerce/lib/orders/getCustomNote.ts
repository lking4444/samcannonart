import Stripe from "stripe"

export function getCustomerNoteFromSession(session: Stripe.Checkout.Session) {
    const noteField = session.custom_fields?.find(
        (field) => field.key === "customer_note"
    )

    const note = noteField?.text?.value?.trim()

    return note || null
}