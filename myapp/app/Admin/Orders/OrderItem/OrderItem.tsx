"use client";

import { getItemImageSrc } from "@/lib/imagepaths";
import { DisplayOrder, OrderStatus } from "@/lib/orders";
import { useEffect, useMemo, useState } from "react";

type OrderItemProps = {
    order: DisplayOrder;
    className?: string;
    onOrderUpdated?: (updatedOrder: DisplayOrder) => void;
  };

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
  PAID: "bg-blue-100 text-blue-800 border border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border border-purple-200",
  COMPLETED: "bg-green-100 text-green-800 border border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  REFUNDED: "bg-slate-200 text-slate-800 border border-slate-300",
};

function formatMoney(value: string, currency: string) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return `${value} ${currency}`;

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(numericValue);
  } catch {
    return `${value} ${currency}`;
  }
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

export default function OrderItem({ order, className = "", onOrderUpdated, }: OrderItemProps) {

  const [originalStatus, setOriginalStatus] = useState<OrderStatus>(order.status);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [localUpdatedAt, setLocalUpdatedAt] = useState<string>(order.updatedAt);
  const [localPaidAt, setLocalPaidAt] = useState<string | null>(order.paidAt ?? null);
  const [localCancelledAt, setLocalCancelledAt] = useState<string | null>(
    order.cancelledAt ?? null
  );
  const [localRefundedAt, setLocalRefundedAt] = useState<string | null>(
    order.refundedAt ?? null
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOriginalStatus(order.status);
    setSelectedStatus(order.status);
    setLocalUpdatedAt(order.updatedAt);
    setLocalPaidAt(order.paidAt ?? null);
    setLocalCancelledAt(order.cancelledAt ?? null);
    setLocalRefundedAt(order.refundedAt ?? null);
    setMessage(null);
    setError(null);
  }, [order]);

  const hasChanges = selectedStatus !== originalStatus;

  const currentStatusClasses = useMemo(
    () => STATUS_STYLES[selectedStatus],
    [selectedStatus]
  );

  const resetChanges = () => {
    setSelectedStatus(originalStatus);
    setMessage(null);
    setError(null);
  };

  const saveChanges = async () => {
    if (!hasChanges) return;
  
    setIsSaving(true);
    setMessage(null);
    setError(null);
  
    try {
      const response = await fetch("/Admin/api/order/by-id", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: order.SessionId,
          status: selectedStatus,
          updatedAt: localUpdatedAt,
        }),
      });
  
      const data = await response.json().catch(() => null);
  
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update order.");
      }
  
      const updatedOrder: DisplayOrder = {
        ...order,
        status: data.status,
        updatedAt: data.updatedAt,
        paidAt: data.paidAt ?? null,
        cancelledAt: data.cancelledAt ?? null,
        refundedAt: data.refundedAt ?? null,
      };
  
      setOriginalStatus(updatedOrder.status);
      setSelectedStatus(updatedOrder.status);
      setLocalUpdatedAt(updatedOrder.updatedAt);
      setLocalPaidAt(updatedOrder.paidAt ?? null);
      setLocalCancelledAt(updatedOrder.cancelledAt ?? null);
      setLocalRefundedAt(updatedOrder.refundedAt ?? null);
  
      onOrderUpdated?.(updatedOrder);
  
      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong while saving."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Order</h2>
          <p className="mt-1 text-sm text-gray-500">Session: {order.SessionId}</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <span className="text-sm font-medium text-gray-700">Status</span>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${currentStatusClasses}`}
            >
              {selectedStatus}
            </span>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className={`rounded-lg px-3 py-2 text-sm font-medium outline-none ring-1 ring-inset ring-gray-300 transition focus:ring-2 focus:ring-gray-400 ${currentStatusClasses}`}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={resetChanges}
              disabled={!hasChanges || isSaving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={saveChanges}
              disabled={!hasChanges || isSaving}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {(message || error) && (
        <div className="mb-6">
          {message && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Customer
          </h3>

          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{order.userEmail}</dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Phone</dt>
              <dd className="text-sm font-medium text-gray-900">
                {order.userPhoneNumber}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Address</dt>
              <dd className="whitespace-pre-line text-sm font-medium text-gray-900">
                {order.userAddress}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Order Summary
          </h3>

          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500">Total Value</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatMoney(order.value, order.currency)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Currency</dt>
              <dd className="text-sm font-medium text-gray-900">{order.currency}</dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Created</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Last Updated</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(localUpdatedAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Paid At</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(localPaidAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Cancelled At</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(localCancelledAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500">Refunded At</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatDate(localRefundedAt)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
          Items
        </h3>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Line Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {order.items.map((item, index) => {
                const lineTotal = (Number(item.unitPrice) * item.quantity).toFixed(2);

                return (
                  <tr key={`${item.itemId}-${index}`}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        {item.item?.imageUrl && item.item?.type ? (
                          <img
                            src={getItemImageSrc(item.item.type, item.item.imageUrl)}
                            alt={item.item?.name || "Order item"}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                            No image
                          </div>
                        )}

                        <div>
                          <div className="font-medium text-gray-900">
                            {item.item?.name || `Item ${item.itemId}`}
                          </div>
                          {item.item?.description && (
                            <div className="mt-1 text-xs text-gray-500">
                              {item.item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700">
                      {formatMoney(item.unitPrice, order.currency)}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatMoney(lineTotal, order.currency)}
                    </td>
                  </tr>
                );
              })}

              {order.items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No items found for this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}