# Portfolio Case Study — Sam Cannon Art Ecommerce Platform

## Summary

I built a full-stack ecommerce platform for an independent artist selling physical artwork and related products. The project includes a customer-facing storefront, stock-aware cart and checkout flow, Stripe Checkout integration, admin product management, image upload and CDN delivery, order management, and accounting export support.

The aim was to build more than a simple product catalogue. The application handles practical ecommerce constraints such as limited stock, checkout reservations, secure admin access, image-heavy product pages, and business-specific shipping and discount logic.

---

## My role

I designed and implemented the full-stack application, including:

- frontend pages and reusable React components;
- server-side API routes;
- Prisma/PostgreSQL schema design;
- stock reservation and checkout logic;
- Stripe Checkout integration;
- admin authentication;
- product and image upload workflows;
- order management features;
- shipping and discount rules;
- privacy/GDPR-facing site content.

---

## Problem

The client needed an ecommerce site that could support several product types, including limited-stock and one-off items. A standard cart flow would not be enough because stock could be oversold if multiple customers attempted checkout at the same time.

The site also needed to be maintainable by the client/admin, with workflows for adding products, uploading images, viewing orders, and exporting order data.

---

## Solution

I built a Next.js App Router application backed by Prisma and PostgreSQL. The storefront allows users to browse products, search/filter categories, view product details, add products to a cart, and proceed to Stripe Checkout.

Before checkout, the app creates a short-lived reservation. This gives the server a temporary claim over the cart items and allows the checkout route to reject expired, hidden, missing, or unavailable items.

Admin users can log in through a credentials-based flow and manage product/order operations through protected admin pages.

---

## Technical highlights

### Stock-safe checkout reservations

Rather than trusting the client cart, checkout begins with a server-side reservation. This protects limited-stock products during the payment flow and creates a clearer boundary between cart state and order state.

### Relational product modelling

The schema uses a base `Item` model with product subtype tables. This allows shared product behaviour while still supporting type-specific metadata for cards, prints, calendars, originals, gifts, slates, and notepads.

### Stripe Checkout integration

The payment flow uses Stripe Checkout. The application creates sessions server-side from validated reservation data and uses unique Stripe session IDs in the order model to reduce duplicate order creation risk.

### Admin operations

The admin section includes product creation/editing, image upload, bulk upload/import workflows, order views, status controls, and QuickBooks/export support.

### Image-heavy ecommerce support

Artwork images are processed server-side and delivered through S3/CloudFront infrastructure, with Next.js configured for CDN-backed remote image loading.

---

## Architecture

```txt
Next.js App Router
  ├── Customer storefront
  ├── Admin dashboard
  ├── API routes
  └── Auth routes

/lib
  ├── Cart/reservation logic
  ├── Database access helpers
  ├── Shipping/discount rules
  ├── Image upload/processing helpers
  ├── Order creation/status logic
  └── Stock helpers

Prisma + PostgreSQL
  ├── Item and subtype tables
  ├── Reservations
  ├── Orders
  └── Order items

External services
  ├── Stripe Checkout
  ├── AWS S3
  └── CloudFront
```

---

## What I learned

- Production ecommerce is mostly about edge cases: stock, expiry, duplicate sessions, failed payment paths, hidden products, and admin workflows.
- A clean `/lib` domain layer makes API routes easier to reason about.
- Payment integration should be treated as a state transition problem, not just a redirect.
- Image-heavy sites need careful planning around compression, storage, CDN delivery, and frontend rendering.
- Public portfolio repos need to demonstrate the work without exposing client data or credentials.

---

## Future improvements

- Add automated unit tests for shipping, discounts, stock reservations, and order creation.
- Add integration tests for checkout failure/success paths.
- Add GitHub Actions CI.
- Add a seeded demo database and safe public demo deployment.
- Add more explicit API response typing.
- Add admin audit logging.
- Add webhook-driven order finalisation if not already present in the production branch.
