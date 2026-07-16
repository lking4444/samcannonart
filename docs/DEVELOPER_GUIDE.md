# Developer Guide

This guide explains how to run, configure, and work on the Sam Cannon Art ecommerce codebase locally.

---

## Prerequisites

Recommended tools:

- Node.js 22+
- npm
- PostgreSQL database
- Stripe test account
- AWS S3 bucket if testing image uploads
- CloudFront distribution if testing CDN image delivery

---

## Environment setup

Create a local `.env` file:

```bash
cp .env.example .env
```

Then fill in the values below.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="bcrypt_hash_here"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

AWS_REGION="eu-west-2"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="..."
CLOUDFRONT_BASE_URL="https://example.cloudfront.net"
```

Do not commit `.env` files.

---

## Prisma workflow

Generate Prisma Client:

```bash
npx prisma generate
```

Create/apply migrations during development:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

Run seed/import scripts only after checking what data they write and which database is targeted.

---

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Generates Prisma Client and creates a production Next.js build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint.

---

## Common workflows

### Add a new product type

1. Add or update the Prisma enum/model if the product requires new data.
2. Create a migration.
3. Add database access helpers under `/lib/db`.
4. Add storefront page or listing support under `/app/(Pages)`.
5. Add admin upload/edit UI support under `/app/Admin`.
6. Update shipping/discount logic if the type affects checkout.
7. Update API routes if the type needs dedicated filtering/search behaviour.

### Update shipping rules

Shipping rules should be changed in `/lib/shipping` rather than directly in the Stripe checkout route.

After changing rules:

1. Test carts with each item type.
2. Test mixed baskets.
3. Test zero-stock and hidden products.
4. Test UK and international checkout branches.
5. Confirm prices sent to Stripe are in pence.

### Update discount rules

Discount logic belongs in `/lib/discount`.

After changing discounts:

1. Test one qualifying item.
2. Test two qualifying items.
3. Test three or more qualifying items.
4. Test mixed gift types.
5. Test non-qualifying product types.
6. Check the Stripe Checkout total.

### Add an admin route

1. Place UI under `/app/Admin`.
2. Place the API route under `/app/Admin/api` if it is admin-only.
3. Ensure the route validates input server-side.
4. Ensure the route requires admin authentication.
5. Avoid exposing sensitive data in response payloads.

### Add an image upload path

1. Add upload UI under admin pages.
2. Add server route under admin API routes.
3. Process image with Sharp if needed.
4. Upload to S3.
5. Store the resulting key/path in the database.
6. Ensure the path resolves through the configured CDN host.

---

## Before committing

Run:

```bash
npm run lint
npm run build
```

Check status:

```bash
git status --short
```

Make sure none of these are staged:

```txt
.env
.env.local
.next/
node_modules/
logs/
*.log
private customer spreadsheets
real order exports
```

---

## Public repo safety checklist

Before showing the repo to employers:

- Replace the default Next.js README.
- Remove real customer/order data.
- Remove private spreadsheets or replace with sanitized examples.
- Add screenshots using demo data only.
- Add `.env.example`, not `.env`.
- Rotate any secret that was ever committed.
- Remove debug `console.log` statements.
- Add build instructions that match the actual folder structure.
- Add a short architecture explanation.

---

## Troubleshooting

### Prisma client errors

Run:

```bash
npx prisma generate
```

Then restart the dev server.

### Database connection errors

Check:

- `DATABASE_URL` exists;
- the database is reachable;
- migrations have been applied;
- the correct local/production database is being used.

### Stripe checkout errors

Check:

- `STRIPE_SECRET_KEY` is present;
- line item prices are in pence;
- the reservation exists;
- the reservation has not expired;
- success/cancel URLs match the local or deployed environment.

### Next/Image remote image errors

Check:

- the image URL is valid;
- the CDN hostname is configured in `next.config.ts`;
- the upstream image returns a valid image response;
- the image path has not changed during upload or migration.
