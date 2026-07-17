# Architecture

This document explains the structure and major system flows for the Sam Cannon Art ecommerce application.

The project is a full-stack Next.js application. The storefront, admin interface, API routes, authentication, and server-side business logic live in the same codebase. Persistence is handled through Prisma and PostgreSQL. Payments are handled through Stripe Checkout. Images are uploaded and processed server-side before being served through S3/CloudFront infrastructure.

---

## High-level system

```txt
Browser
  ↓
Next.js App Router
  ↓
Route handlers / server components / client components
  ↓
Domain logic in /lib
  ↓
Prisma Client
  ↓
PostgreSQL
```

External services:

```txt
Stripe Checkout       Payment collection and payment-session state
AWS S3                Original/processed artwork image storage
CloudFront            CDN delivery for product images
NextAuth              Admin authentication flow
```

---

## Main directories

```txt
app/
  (Pages)/             Customer-facing pages and public API routes
  Admin/               Admin dashboard pages and admin API routes
  Checkout/            International checkout path
  Components/          Shared layout and UI components
  Hooks/               Shared React hooks
  Store/               Zustand stores
  Types/               Shared TypeScript types
  api/auth/            NextAuth route

lib/
  auth/                Auth helpers and admin checks
  cart/                Cart loading, checkout, reservation helpers
  contentRecommendation/ Handles content recommendation logic
  db/                  Database access functions by domain/category
  discount/            Discount business logic
  filtering/           Product/admin filtering helpers
  images/              Image paths, uploads, processing
  imports/             Import-related types
  orders/              Order creation/display/status logic
  shipping/            UK/international shipping calculations
  stock/               Stock lookup/update helpers
  uploads/             Upload helpers

prisma/
  schema.prisma        Database schema
  migrations/          Database migrations
```

---

## Data model overview

The schema uses a shared `Item` model with category-specific tables for product types.

```txt
Item
  ├── Card
  ├── Print
  ├── Calendar
  ├── NotePad
  ├── Original
  └── Gift

```

This design gives the storefront a common product shape while still supporting type-specific fields.

Core commerce models:

```txt
Reservation
  └── ReservationItem

Order
  └── OrderItem
```

Important behaviours supported by the schema:

- `Item.uploadId` is unique.
- `Item.hidden` supports hiding products without deleting them.
- `Item.stock` supports availability checks.
- `Reservation.expiresAt` allows short-lived checkout reservations.
- `ReservationItem` has a unique pair of `reservationId` and `itemId`.
- `Order.SessionId` is unique to reduce duplicate order creation from the same Stripe session.
- `Order.status` supports order lifecycle tracking.

---

## Customer storefront flow

```txt
User visits category/search/product page
  ↓
Next.js route loads product data
  ↓
User adds product to cart
  ↓
Cart state stored client-side
  ↓
User starts checkout
  ↓
Server checks product availability
  ↓
Reservation is created
  ↓
Stripe Checkout Session is created
  ↓
User pays through Stripe
  ↓
Success route creates order from Stripe session/reservation
  ↓
Cart is cleared
```

---

## Reservation flow

The reservation layer is one of the most important parts of the application.

Without reservations, two customers could theoretically start checkout for the same limited-stock item at the same time. The reservation flow gives the app a temporary server-side claim over the items in a basket.

```txt
Cart items
  ↓
POST /api/reservations/create
  ↓
Validate item IDs and quantities
  ↓
Check products exist and are not hidden
  ↓
Check available stock after existing reservations
  ↓
Create Reservation with expiry time
  ↓
Create ReservationItem rows
  ↓
Return reservation ID to client
```

The Stripe checkout route then depends on a valid, unexpired reservation.

---

## Checkout flow

```txt
Client checkout action
  ↓
Create reservation
  ↓
POST /api/stripe/checkout
  ↓
Load reservation and items
  ↓
Reject missing or expired reservation
  ↓
Build Stripe line items
  ↓
Apply shipping/discount logic
  ↓
Create Stripe Checkout Session
  ↓
Redirect customer to Stripe-hosted checkout
```

After payment:

```txt
Stripe success redirect
  ↓
Success page receives session_id
  ↓
Server retrieves Stripe session
  ↓
Reservation ID is read from metadata
  ↓
Order is created
  ↓
Order items are created
  ↓
Stock is decremented
```

---

## Admin flow

Admin access is protected by credentials authentication.

```txt
Admin visits /login
  ↓
Credentials submitted to NextAuth
  ↓
Email is compared against ADMIN_EMAIL
  ↓
Password is checked with bcrypt against ADMIN_PASSWORD_HASH
  ↓
JWT session is created
  ↓
Admin routes become accessible
```

Admin capabilities include:

- adding individual items;
- uploading products from spreadsheets;
- uploading images individually or in bulk;
- editing existing products;
- hiding/deleting products;
- viewing orders;
- changing order status;
- exporting order data for accounting.

---

## Image pipeline

```txt
Admin selects/upload images
  ↓
API route receives multipart upload
  ↓
Sharp processes image
  ↓
Processed asset is uploaded to S3
  ↓
Product stores image key/path
  ↓
CloudFront serves image
  ↓
Next/Image renders from configured remote CDN host
```

The application config allows images from a CloudFront hostname. This means product images can be delivered through CDN infrastructure rather than directly through the application server.

---

## API route groups

Public/customer routes:

```txt
/api/items/[id]/availability
/api/items/by-ids
/api/items/by-type
/api/items/dimensions
/api/items/popular
/api/items/recommendations
/api/items/search
/api/items/tags
/api/reservations/create
/api/stripe/checkout
/api/stripe/internationalCheckout
/api/stripe/updateInternationalShipping
/api/images/[...key]
```

Admin routes:

```txt
/Admin/api/add
/Admin/api/add-many
/Admin/api/images/bulk
/Admin/api/images/bulk-with-id
/Admin/api/images/single
/Admin/api/items
/Admin/api/items/[id]
/Admin/api/items/delete/[id]
/Admin/api/items/existing-upload-ids
/Admin/api/items/tags
/Admin/api/order/by-id
/Admin/api/order/get-all
```