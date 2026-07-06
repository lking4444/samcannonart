# Sam Cannon Art — Full-Stack Ecommerce Platform

A production-oriented ecommerce platform for an independent artist, built with **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL**, **Stripe Checkout**, **AWS S3**, and **CloudFront**.

This project was built around real ecommerce constraints rather than a generic storefront demo: stock-aware checkout, short-lived cart reservations, admin-only product management, image upload and optimisation, Stripe payment sessions, custom shipping rules, order management, and accounting export support.

> **Portfolio note:** this public version is intended to demonstrate engineering approach and architecture. Production secrets, private customer data, real admin credentials, and sensitive business data should not be committed to this repository.

---

## Contents

- [Why this project matters](#why-this-project-matters)
- [Core features](#core-features)
- [Tech stack](#tech-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [Key engineering challenges](#key-engineering-challenges)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Useful scripts](#useful-scripts)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [What I would improve next](#what-i-would-improve-next)

---

## Why this project matters

Many portfolio ecommerce projects stop at listing products and sending a user to checkout. This project goes further by handling the parts of ecommerce that usually create production bugs:

- preventing overselling while a customer is checking out;
- creating orders from Stripe sessions only after payment has completed;
- storing product, order, reservation, and customer fulfilment data in a relational schema;
- protecting admin-only routes;
- handling large artwork uploads;
- serving optimised images through CDN infrastructure;
- supporting business-specific shipping and discount rules;
- providing admin workflows for product and order management.

The result is a realistic full-stack application with both customer-facing and admin-facing functionality.

---

## Core features

### Customer storefront

- Product browsing across categories such as cards, calendars, gifts, originals, prints, slates, and notepads.
- Product detail pages with images, descriptions, pricing, availability, and suggested content.
- Search and filtering support for product discovery.
- Responsive layout with custom CSS modules and mobile navigation.
- Cart drawer powered by client-side state management.
- Stock validation before checkout.

### Checkout and stock reservation

- Short-lived reservation flow before payment.
- Server-side availability checks before creating a checkout session.
- Stripe Checkout integration for card and wallet-based payment flows.
- Success and cancellation routes for completed or abandoned sessions.
- Order creation and stock update logic after successful checkout.
- Separate international checkout work-in-progress path.

### Admin system

- Credentials-based admin login.
- Admin-only product management routes.
- Product upload and edit workflows.
- Bulk image upload workflows.
- Excel/XLSX import support for catalogue data.
- Order list and detailed order views.
- Order status controls.
- QuickBooks/accounting export support.

### Image handling

- Artwork image uploads via admin routes.
- S3-backed storage integration.
- Sharp-based image processing.
- CloudFront-backed remote image delivery.
- Next.js image configuration for trusted CDN image sources.

### Data and privacy

- Prisma schema for products, reservations, orders, order items, and product subtype tables.
- Stored order fulfilment data including email, phone/address fields, order value, order status, and audit timestamps.
- Privacy page included in the application.
- Environment-variable-based secrets for admin authentication and service credentials.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React, CSS Modules, Headless UI, Radix Dialog, React Select |
| State | Zustand |
| Authentication | NextAuth credentials provider, bcrypt password verification |
| Database | PostgreSQL with Prisma ORM |
| Payments | Stripe Checkout |
| Images/storage | AWS S3, CloudFront, Sharp, Next/Image |
| Admin imports/exports | XLSX, React Datepicker |
| Tooling | ESLint, Prisma CLI, TypeScript |

---

## Architecture at a glance

```txt
Customer browser
  ↓
Next.js App Router pages and components
  ↓
API routes for catalogue, reservations, checkout, images, and admin actions
  ↓
Domain logic in /lib
  ↓
Prisma ORM
  ↓
PostgreSQL
```

Checkout flow:

```txt
Cart
  ↓
Create reservation
  ↓
Validate stock and reservation expiry
  ↓
Create Stripe Checkout Session
  ↓
Stripe payment
  ↓
Success route retrieves session
  ↓
Create order and order items
  ↓
Reduce stock / clear cart
```

Image flow:

```txt
Admin upload
  ↓
Server-side image processing
  ↓
S3 object storage
  ↓
CloudFront CDN
  ↓
Next/Image rendering
```

For a deeper breakdown, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Key engineering challenges

### 1. Preventing overselling

The checkout flow uses a reservation model rather than directly sending cart items to payment. This is important because unique art products and limited-stock items should not be sold twice if two customers check out at the same time.

### 2. Separating product logic from route handlers

Business rules are grouped under `/lib`, including cart, database, discount, filtering, image, order, shipping, and stock logic. This keeps API routes focused on request/response handling.

### 3. Handling product categories with different data requirements

The database models a shared `Item` table with related subtype tables for cards, prints, calendars, originals, gifts, slates, and notepads. That gives the application a common product interface while still supporting category-specific fields.

### 4. Integrating payments safely

Stripe Checkout is used for payment collection, but order creation is treated as a server-side concern. The application stores Stripe session IDs uniquely to reduce duplicate order creation risk.

### 5. Supporting an admin workflow

The project includes protected admin pages for adding, editing, uploading, importing, viewing, and exporting operational ecommerce data.

---

## Project structure

Current public branch structure:

```txt
myapp/
  app/                  Next.js App Router routes, pages, layouts, UI, API routes
  lib/                  Domain logic: cart, orders, shipping, stock, images, db access
  prisma/               Prisma schema and migrations
  public/               Static assets
  auth.ts               NextAuth credentials configuration
  middleware.ts         Admin route protection / auth middleware
  next.config.ts        Next.js configuration, image/CDN settings
  package.json          Scripts and dependencies
  prisma.config.ts      Prisma configuration
  tsconfig.json         TypeScript configuration
```

For a public employer-facing repository, consider moving the contents of `myapp/` to the repository root so the code opens immediately when someone lands on the repo.

---

## Documentation

Recommended documentation set for this repo:

- [`README.md`](README.md) — portfolio-facing overview and setup.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design, data model, and major flows.
- [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) — local setup, scripts, environment variables, and common workflows.
- [`docs/API_OVERVIEW.md`](docs/API_OVERVIEW.md) — public/admin API route map.
- [`docs/SECURITY_AND_PRIVACY.md`](docs/SECURITY_AND_PRIVACY.md) — secrets, admin auth, customer data, and public repo safety.
- [`docs/PORTFOLIO_CASE_STUDY.md`](docs/PORTFOLIO_CASE_STUDY.md) — employer-facing project write-up.

---

## Future deliverables

- Add automated tests for shipping, discounts, stock reservation, and order creation.
- Add GitHub Actions CI for linting and production builds.
- Improve typed API response contracts.
- Add richer admin audit logs for order/product changes.
- Add more formal accessibility testing for the storefront and admin UI.

