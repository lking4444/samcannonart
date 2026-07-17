# API Overview

This document maps the main API routes used by the Sam Cannon Art ecommerce application.

The app uses Next.js App Router route handlers. Public/customer APIs live under `/app/(Pages)/api`, while admin-specific APIs live under `/app/Admin/api`.

---

# Public/customer API routes

## api/items

### `GET /api/items/search`

Searches products for storefront discovery.

Typical responsibilities:

- read query string parameters;
- filter out hidden products;
- support pagination;
- return product tiles/listing data.

### `GET /api/items/by-type`

Returns products for a given item type/category.

Used by category pages such as cards, prints, originals, gifts, calendars, and notepads.

### `POST /api/items/by-ids`

Returns product details for a set of item IDs.

Used by cart-loading workflows where the client has stored item IDs and needs current price/image/stock data from the server.

### `GET /api/items/[id]/availability`

Checks whether an item exists and has available stock.

Used before checkout or add-to-cart flows to prevent users proceeding with unavailable products.

### `GET /api/items/popular`

Returns popular products for homepage or recommendation sections.

### `GET /api/items/recommendations`

Returns suggested products based on the current item.

### `GET /api/items/tags`

Returns product tags for filtering/search UI.

### `GET /api/items/dimensions`

Returns product dimensions, primarily useful for print filtering and shipping calculations.

## api/stripe

### `POST /api/stripe/checkout`

Creates a Stripe Checkout Session from a valid reservation.

Expected responsibilities:

- validate the reservation ID;
- reject missing/expired reservations;
- load reserved items;
- calculate line items, discounts, and shipping;
- attach reservation metadata;
- return a Stripe Checkout URL.

### `POST /api/stripe/internationalCheckout`

International checkout path.

This appears to support a separate international checkout flow from the standard UK checkout flow.

### `POST /api/stripe/updateInternationalShipping`

Updates or calculates shipping details for the international checkout branch.

### `POST /api/reservations/create`

Creates a temporary checkout reservation.

- validate cart item IDs and quantities;
- check products exist and are not hidden;
- account for available stock;
- create a reservation with an expiry time;
- return a reservation ID to the client;
- return structured errors for unavailable items.

This is one of the most important APIs in the app because it protects limited-stock products from overselling during checkout.

---

## Admin API routes

Admin routes protected and never trust client-side validation alone.

### `POST /Admin/api/add`

Adds a single product/item.

### `POST /Admin/api/add-many`

Adds multiple products/items, likely from spreadsheet/import data.

### `POST /Admin/api/images/single`

Uploads a single image.

### `POST /Admin/api/images/bulk`

Uploads multiple images.

### `POST /Admin/api/images/bulk-with-id`

Uploads multiple images while preserving or assigning upload IDs.

### `GET /Admin/api/items`

Returns admin-facing product data.

### `PATCH/PUT/DELETE /Admin/api/items/[id]`

Updates an individual item.

### `/Admin/api/items/delete/[id]`

Deletes or hides an item.

For production safety, hiding is often preferable to hard deletion when orders may reference historical products.

### `GET /Admin/api/items/existing-upload-ids`

Returns existing upload IDs to prevent duplicate product/image identifiers.

### `GET /Admin/api/items/tags`

Returns tags for admin filtering/editing.

### `GET /Admin/api/order/get-all`

Returns orders for the admin order list.

### `GET /Admin/api/order/by-id`

Returns a detailed order view by order ID.

---

## API design notes

### Validate at the edge of every route

Every route should validate:

- request method;
- required body/query fields;
- integer IDs;
- quantities greater than zero;
- enum values;
- authentication/authorization for admin routes.

### Keep business logic in `/lib`

Routes should call functions from `/lib` rather than embedding complex logic directly. This keeps route handlers easier to read and makes core behaviours easier to test.

### Return structured errors

For checkout and stock problems, prefer structured responses such as:

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

This lets the frontend show useful messages instead of a generic failure.

### Avoid leaking admin/customer data

Public routes should not return:

- customer addresses;
- phone numbers;
- admin emails;
- order details;
- hidden/private products unless intentionally exposed.
