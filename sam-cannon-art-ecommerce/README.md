# Sam Cannon Art — Full-Stack Ecommerce Platform

A production-style ecommerce platform built for an independent artist selling physical artwork, prints, cards, calendars, gifts, and one-off originals.

This project was designed as more than a simple storefront. It handles real ecommerce concerns including limited-stock products, stock-safe checkout reservations, Stripe Checkout payments, admin product management, bulk image uploads, CDN-backed image delivery, order management, and business-specific shipping and discount logic.

---

## Project Overview

Sam Cannon Art is a full-stack **Next.js ecommerce application** with a customer-facing storefront, protected admin dashboard, relational database, payment flow, and server-side business logic.

The application supports:

- Product browsing, search, filtering, and recommendations
- Category-specific product pages
- Client-side cart state with server-side validation
- Temporary checkout reservations to reduce overselling risk
- Stripe Checkout integration
- UK and international checkout branches
- Admin authentication
- Product creation, editing, hiding, and deletion
- Image upload and processing workflows
- AWS S3 and CloudFront image delivery
- Order viewing and status management
- Privacy/GDPR-facing site content

The main goal was to build a maintainable ecommerce system that reflects the kind of edge cases found in real production applications.

---

## Screenshots

### Homepage

![Homepage screenshot](./docs/screenshots/homescreen.webp)

### Homepage Search

![Homepage screenshot](./docs/screenshots/homesearch.webp)

### Product Page

![Product listing screenshot](./docs/screenshots/cards.webp)

### Product Page with Filter

![Product listing screenshot](./docs/screenshots/cardFilters.webp)

### Product Details Page

![Product details screenshot](./docs/screenshots/itemDetails.webp)

### Cart Drawer

![Cart drawer screenshot](./docs/screenshots/cart.webp)

### Stripe Checkout Flow

![Checkout screenshot](./docs/screenshots/stripe.webp)

### Admin Dashboard

![Admin dashboard screenshot](./docs/screenshots/adminhome.webp)

### Order Management

![Order management screenshot](./docs/screenshots/orders.webp)

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Frontend | React, CSS Modules |
| State Management | Zustand |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Payments | Stripe Checkout |
| Authentication | NextAuth credentials flow |
| Image Processing | Sharp |
| Image Storage | AWS S3 |
| Image Delivery | CloudFront |
| Deployment | Vercel |
| Business Logic | Server-side route handlers and `/lib` domain modules |

---

## Why This Project Is Interesting

Many ecommerce projects look impressive visually but avoid the harder backend problems.

This project focuses on the engineering details that matter in a real store:

- Limited-stock products need protection from overselling
- Payment sessions need to be linked safely to internal order state
- Client cart data cannot be trusted at checkout time
- Admin routes must be protected and validated server-side
- Large artwork images need processing, storage, and CDN delivery
- Shipping and discount rules need to be deterministic and testable
- Public repos need to be sanitized before being shown to employers

---

## Core Features

### Customer Storefront

The storefront allows customers to browse artwork and related products through category pages, search, product details pages, recommendation sections, and a persistent cart drawer.

Supported product types include:

- Cards
- Prints
- Calendars
- Originals
- Notepads
- Gifts
- Slates

The product model is designed around a shared `Item` table with category-specific subtype data, giving the app a common product shape while still supporting specialist fields.

---

### Stock-Safe Reservation Checkout

One of the most important parts of the system is the checkout reservation flow.

A normal client-side cart is not enough for limited-stock products. If two users attempt to buy the same one-off item at the same time, the system needs a server-side way to decide who can proceed.

This app solves that by creating a short-lived reservation before Stripe Checkout is created.

```txt
Cart items
  ↓
POST /api/reservations/create
  ↓
Validate item IDs and quantities
  ↓
Check products exist and are visible
  ↓
Check available stock after active reservations
  ↓
Create temporary reservation
  ↓
Create Stripe Checkout Session
  ↓
Redirect customer to Stripe
```

The Stripe checkout route depends on a valid, unexpired reservation. This means checkout is based on fresh server-side product data rather than stale client cart state.

---

### Stripe Checkout Integration

The app creates Stripe Checkout Sessions server-side after validating the reservation.

The checkout route is responsible for:

- Rejecting missing or expired reservations
- Loading reserved items from the database
- Calculating line items
- Applying shipping
- Applying discounts
- Attaching reservation metadata
- Returning a Stripe-hosted Checkout URL

After successful payment, the success route retrieves the Stripe session, reads the reservation metadata, creates the order, creates order items, and decrements stock.

To reduce duplicate order creation risk, Stripe session IDs are treated as unique order identifiers.

---

### Admin Dashboard

The project includes a protected admin area for managing the store.

Admin functionality includes:

- Adding individual products
- Bulk product creation
- Image uploads
- Bulk image uploads
- Product editing
- Hiding or deleting products
- Viewing orders
- Viewing detailed order information
- Updating order status
- Exporting order data for accounting workflows

Admin access is protected through a credentials-based NextAuth flow using environment-driven credentials and a hashed password.

```txt
Admin login
  ↓
Credentials submitted
  ↓
Email checked against ADMIN_EMAIL
  ↓
Password checked with bcrypt
  ↓
JWT session created
  ↓
Protected admin routes become available
```

---

### Image Upload and CDN Delivery

Because the site is image-heavy, the image pipeline is designed to avoid serving large original files directly through the application server.

```txt
Admin uploads image
  ↓
Server receives multipart upload
  ↓
Sharp processes image
  ↓
Processed file uploaded to S3
  ↓
Product stores image key/path
  ↓
CloudFront serves image
  ↓
Next/Image renders CDN image
```

This gives the application a cleaner separation between product data, image storage, and image delivery.

---

### Shipping and Discount Logic

Shipping and discount rules are kept in `/lib` rather than embedded directly inside route handlers.

This makes the checkout route easier to read and makes business rules easier to test, change, and reason about.

Examples of business rules handled by the app include:

- UK shipping calculations
- International checkout branch support
- Mixed basket shipping behaviour
- Gift item discounts
- Free shipping cases
- Limited-stock checkout validation

---

## Architecture

```txt
Browser
  ↓
Next.js App Router
  ↓
Pages / Server Components / Client Components
  ↓
API Route Handlers
  ↓
Domain Logic in /lib
  ↓
Prisma Client
  ↓
PostgreSQL
```

External services:

```txt
Stripe Checkout       Payment collection
AWS S3                Image storage
CloudFront            CDN image delivery
NextAuth              Admin authentication
Vercel                Hosting and deployment
```

---

## Directory Structure

```txt
app/
  (Pages)/             Customer-facing pages and public API routes
  Admin/               Admin dashboard pages and admin API routes
  Checkout/            International checkout path
  Components/          Shared UI and layout components
  Hooks/               Shared React hooks
  Store/               Zustand stores
  Types/               Shared TypeScript types
  api/auth/            NextAuth route

lib/
  auth/                Authentication helpers and admin checks
  cart/                Cart and reservation helpers
  contentRecommendation/
                        Recommendation logic
  db/                  Database access functions
  discount/            Discount business logic
  filtering/           Product/admin filtering helpers
  images/              Image paths, uploads, and processing
  imports/             Import-related types
  orders/              Order creation, display, and status logic
  shipping/            Shipping calculations
  stock/               Stock lookup and update helpers
  uploads/             Upload helpers

prisma/
  schema.prisma        Database schema
  migrations/          Database migrations
```

---

## Data Model Overview

The database uses a shared `Item` model with category-specific subtype tables.

```txt
Item
  ├── Card
  ├── Print
  ├── Calendar
  ├── NotePad
  ├── Original
  └── Gift
```

Core commerce models:

```txt
Reservation
  └── ReservationItem

Order
  └── OrderItem
```

Important schema behaviours include:

- Unique product upload IDs
- Hidden products rather than unsafe hard deletion
- Item stock tracking
- Reservation expiry
- Unique reservation item pairs
- Unique Stripe session IDs on orders
- Order lifecycle status tracking

---

## API Overview

The app uses Next.js App Router route handlers.

Public/customer routes live under:

```txt
/app/(Pages)/api
```

Admin-specific routes live under:

```txt
/app/Admin/api
```

---

### Public API Routes

| Route | Purpose |
|---|---|
| `GET /api/items/search` | Product search and storefront discovery |
| `GET /api/items/by-type` | Product listing by category |
| `POST /api/items/by-ids` | Load current product data for cart items |
| `GET /api/items/[id]/availability` | Check product existence and stock |
| `GET /api/items/popular` | Homepage or featured product sections |
| `GET /api/items/recommendations` | Suggested products based on current item |
| `GET /api/items/tags` | Tags for filtering/search UI |
| `GET /api/items/dimensions` | Product dimensions, mainly for prints |
| `POST /api/reservations/create` | Create temporary checkout reservation |
| `POST /api/stripe/checkout` | Create Stripe Checkout Session |
| `POST /api/stripe/internationalCheckout` | International checkout branch |
| `POST /api/stripe/updateInternationalShipping` | International shipping calculation/update |
| `GET /api/images/[...key]` | Image proxy/loader route |

---

### Admin API Routes

| Route | Purpose |
|---|---|
| `POST /Admin/api/add` | Add a single product |
| `POST /Admin/api/add-many` | Add multiple products |
| `POST /Admin/api/images/single` | Upload a single image |
| `POST /Admin/api/images/bulk` | Upload multiple images |
| `POST /Admin/api/images/bulk-with-id` | Bulk upload images with upload IDs |
| `GET /Admin/api/items` | Retrieve admin product data |
| `PATCH /Admin/api/items/[id]` | Update an item |
| `DELETE /Admin/api/items/[id]` | Delete or hide an item |
| `GET /Admin/api/items/existing-upload-ids` | Check existing upload IDs |
| `GET /Admin/api/items/tags` | Admin tag data |
| `GET /Admin/api/order/get-all` | Admin order list |
| `GET /Admin/api/order/by-id` | Detailed order view |

---

## API Design Principles

### Validate at Every Route Boundary

API routes validate incoming data rather than trusting the client.

Validation includes:

- Required body/query fields
- Integer IDs
- Positive quantities
- Enum values
- Reservation IDs
- Admin authentication
- Authorization for protected routes

---

### Keep Route Handlers Thin

Complex business logic lives in `/lib`.

This keeps API route handlers focused on:

- Reading the request
- Validating input
- Calling domain functions
- Returning a response

---

### Return Structured Errors

Checkout and stock failures return structured data so the frontend can show useful messages.

Example:

```json
{
  "error": "Some items are unavailable",
  "reason": "reserved_or_out_of_stock",
  "items": [
    {
      "id": 1,
      "name": "Example item",
      "requested": 2,
      "available": 1
    }
  ]
}
```

This is much better for user experience than a generic checkout failure.

---

### Avoid Leaking Private Data

Public routes should never expose:

- Customer addresses
- Phone numbers
- Admin emails
- Private order details
- Hidden products
- Internal admin-only metadata

---

## Local Development

### Prerequisites

Recommended tools:

- Node.js 22+
- npm
- PostgreSQL database
- Stripe test account
- AWS S3 bucket for image upload testing
- CloudFront distribution for CDN image testing

---

### Environment Variables

Create a local `.env` file:

```bash
cp .env.example .env
```

Example environment values:

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

Never commit real `.env` files.

---

### Install Dependencies

```bash
npm install
```

---

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Run Migrations

```bash
npx prisma migrate dev
```

---

### Start the Development Server

```bash
npm run dev
```

---

### Open Prisma Studio

```bash
npx prisma studio
```

---

## Available Scripts

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

## Common Development Workflows

### Adding a New Product Type

1. Update the Prisma enum/model if the product requires new fields.
2. Create a migration.
3. Add database access helpers under `/lib/db`.
4. Add storefront listing/detail support.
5. Add admin upload/edit support.
6. Update shipping and discount logic if needed.
7. Update API routes if the type needs dedicated filtering behaviour.

---

### Updating Shipping Rules

Shipping rules should be changed in:

```txt
/lib/shipping
```

After changing shipping logic, test:

- Each product type
- Mixed baskets
- Zero-stock products
- Hidden products
- UK checkout
- International checkout
- Stripe totals in pence

---

### Updating Discount Rules

Discount logic should be changed in:

```txt
/lib/discount
```

After changing discount logic, test:

- One qualifying item
- Two qualifying items
- Three or more qualifying items
- Mixed gift types
- Non-qualifying products
- Final Stripe Checkout totals

---

### Adding an Admin Route

1. Place admin UI under `/app/Admin`.
2. Place admin-only API routes under `/app/Admin/api`.
3. Validate all input server-side.
4. Require admin authentication.
5. Avoid exposing sensitive data in response payloads.

---

### Adding an Image Upload Path

1. Add upload UI under the admin pages.
2. Add a server route under admin API routes.
3. Process the image with Sharp if required.
4. Upload the processed image to S3.
5. Store the resulting key/path in the database.
6. Ensure the path resolves through the configured CDN host.

---

## Testing Checklist

Before considering the project ready for demo or deployment, test the following flows.

### Storefront

- Browse each product category
- Search for products
- Open product details pages
- Add products to cart
- Remove products from cart
- Refresh with cart state persisted
- View recommended products

### Stock and Reservations

- Attempt checkout with valid stock
- Attempt checkout with zero stock
- Attempt checkout with hidden products
- Attempt checkout with a stale cart
- Attempt checkout after reservation expiry
- Attempt checkout for limited-stock items from two sessions

### Stripe Checkout

- Create checkout session successfully
- Cancel checkout and return to site
- Complete checkout successfully
- Confirm order creation
- Confirm stock decrement
- Confirm duplicate session handling

### Admin

- Log in with valid credentials
- Reject invalid credentials
- Add a product
- Edit a product
- Hide/delete a product
- Upload one image
- Bulk upload images
- View orders
- Update order status

### Images

- Confirm uploaded images appear in the storefront
- Confirm CDN image URLs work
- Confirm `next.config.ts` allows the CDN hostname
- Confirm images do not distort on responsive layouts

---

## Public Repo Safety Checklist

Before making this repository public or sending it to employers:

- Remove real customer/order data
- Remove private spreadsheets
- Replace real exports with sanitized examples
- Include `.env.example`, not `.env`
- Rotate any secret that was ever committed
- Remove debug `console.log` statements
- Check that screenshots use demo data only
- Check that admin credentials are not included
- Check that deployment URLs do not expose private dashboards
- Run lint and build
- Write a short project summary at the top of the repo
- Include architecture notes and setup instructions

---

## Troubleshooting

### Prisma Client Errors

Run:

```bash
npx prisma generate
```

Then restart the dev server.

---

### Database Connection Errors

Check that:

- `DATABASE_URL` exists
- The database is reachable
- Migrations have been applied
- The correct local or production database is being used

---

### Stripe Checkout Errors

Check that:

- `STRIPE_SECRET_KEY` is present
- Item prices are sent in pence
- The reservation exists
- The reservation has not expired
- Success and cancel URLs match the current environment

---

### Next/Image Remote Image Errors

Check that:

- The image URL is valid
- The CDN hostname is configured in `next.config.ts`
- The upstream response is a valid image
- The image path has not changed during upload or migration

---

## What I Learned

This project reinforced that production ecommerce is mostly about edge cases.

The most important lessons were:

- Cart state should never be trusted at payment time
- Payment integration is a state transition problem, not just a redirect
- Stock handling needs to account for concurrency
- Admin workflows matter as much as customer-facing pages
- Image-heavy websites need careful storage and delivery planning
- Business rules should live in dedicated modules, not inside route handlers
- Public portfolio repositories need careful sanitisation

---

## Future Improvements

Planned improvements include:

- Unit tests for shipping, discounts, reservations, and order creation
- Integration tests for checkout success and failure paths
- GitHub Actions CI
- Seeded demo database
- Public demo deployment using sanitized data
- Stronger API response typing
- Admin audit logging
- Webhook-driven order finalisation
- Improved international checkout coverage

---

## Project Status

This repository is intended as a professional portfolio version of a real ecommerce build.

Sensitive data, real customer information, private spreadsheets, and production credentials should not be included.

The project demonstrates full-stack product engineering across frontend, backend, database design, payments, image infrastructure, authentication, and admin tooling.
