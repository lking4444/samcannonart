import Link from "next/link"

import styles from "./Privacy.module.css"

export default function PrivacyPage() {
  return (
    <main className={styles.siteBackground}>
      <section className={styles.privacyContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.privacyTitle}>
            Privacy <span className={styles.privacyTitleColour}>Policy</span>
          </h1>

          <p className={styles.updatedText}>Last updated: January 2026</p>
        </div>

        <div className={styles.policyCard}>
          <section className={styles.policySection}>
            <h2>Who we are</h2>
            <p>
              This website is operated by Sam Cannon Art. We sell artwork and
              related products through our online store.
            </p>
            <p>
              If you have any questions about this Privacy Policy or how your
              personal information is handled, you can contact us at:
            </p>
            <p className={styles.contactText}>
                samanthacannon@hotmail.com
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>What personal information we collect</h2>
            <p>
              When you place an order, we collect the information needed to
              process your payment and deliver your order. This may include:
            </p>

            <ul>
              <li>your name;</li>
              <li>your email address;</li>
              <li>your billing address;</li>
              <li>your delivery address;</li>
              <li>details of the items you ordered;</li>
              <li>payment and transaction information processed by Stripe.</li>
            </ul>

            <p>
              We do not store your full card details on our own systems. Payment
              details are processed securely by Stripe.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>How we use your information</h2>
            <p>We use your personal information to:</p>

            <ul>
              <li>process and fulfil your order;</li>
              <li>take payment securely through Stripe;</li>
              <li>send order confirmations and important order updates;</li>
              <li>arrange delivery;</li>
              <li>handle refunds, returns, support requests, and disputes;</li>
              <li>keep accounting, tax, and financial audit records;</li>
              <li>protect our business from fraud or misuse.</li>
            </ul>

            <p>
              We do not use your checkout information for email marketing, SMS
              marketing, or telephone marketing.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>Our lawful basis for using your information</h2>
            <p>
              Under UK data protection law, we need a lawful basis to use your
              personal information.
            </p>

            <ul>
              <li>
                <strong>Contract:</strong> we use your information to process
                your order, take payment, and deliver your purchase.
              </li>
              <li>
                <strong>Legal obligation:</strong> we keep certain order and
                transaction records for accounting, tax, and audit purposes.
              </li>
              <li>
                <strong>Legitimate interests:</strong> we may use limited order
                information to manage refunds, disputes, chargebacks, fraud
                prevention, and customer support.
              </li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>Who we share your information with</h2>
            <p>
              We only share personal information where necessary to run our
              store, process payments, deliver orders, or comply with legal
              obligations.
            </p>

            <p>This may include:</p>

            <ul>
              <li>Stripe, for secure payment processing;</li>
              <li>delivery or shipping providers, to deliver your order;</li>
              <li>website, hosting, or technical service providers;</li>
              <li>professional advisers where needed for accounting or legal matters;</li>
              <li>authorities where required by law.</li>
            </ul>

            <p>
              We do not sell your personal information.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>Stripe payments</h2>
            <p>
              We use Stripe to process payments. Stripe may collect and process
              payment information, billing details, transaction details, and
              fraud-prevention information when you complete a purchase.
            </p>

            <p>
              You can read more about how Stripe handles personal information in
              Stripe&apos;s own privacy policy.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>Your rights</h2>
            <p>
              Depending on the circumstances, you may have the right to:
            </p>

            <ul>
              <li>access the personal information we hold about you;</li>
              <li>ask us to correct inaccurate information;</li>
              <li>ask us to delete information where we no longer need it;</li>
              <li>object to certain uses of your information;</li>
              <li>ask us to restrict how we use your information;</li>
              <li>request a copy of your information in a portable format.</li>
            </ul>

            <p>
              Some information may need to be retained where we have a legal
              obligation or legitimate business reason, such as accounting,
              audit, dispute, or fraud-prevention records.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>Security</h2>
            <p>
              We take reasonable steps to protect your personal information. Our
              payment processing is handled by Stripe, and administrative access
              to payment systems is protected using two-factor authentication.
            </p>

            <p>
              We aim to limit access to personal information to those who need it
              to fulfil orders, manage payments, provide support, or meet legal
              obligations.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>Complaints</h2>
            <p>
              If you are unhappy with how we handle your personal information,
              please contact us first so we can try to resolve the issue.
            </p>

            <p>
              You also have the right to complain to the UK Information
              Commissioner&apos;s Office.
            </p>
          </section>

          <div className={styles.backLinkContainer}>
            <Link href="/" className={styles.backLink}>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}