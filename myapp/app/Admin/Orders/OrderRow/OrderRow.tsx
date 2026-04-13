"use client";

import type { DisplayOrder } from "@/lib/orders";

type OrderRowProps = {
  order: DisplayOrder;
  isSelected?: boolean;
  onClick: () => void;
};

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

const STATUS_STYLES: Record<DisplayOrder["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
  PAID: "bg-blue-100 text-blue-800 border border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border border-purple-200",
  COMPLETED: "bg-green-100 text-green-800 border border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  REFUNDED: "bg-slate-200 text-slate-800 border border-slate-300",
};

export default function OrderRow({
  order,
  isSelected = false,
  onClick,
}: OrderRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        isSelected
          ? "border-gray-900 bg-gray-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="grid gap-4 md:grid-cols-5 md:items-start">
        <div className="min-w-0 self-start">
          <p className="mb-1 text-xs text-gray-500">Email</p>
          <p className="truncate text-sm font-medium text-gray-900">
            {order.userEmail}
          </p>
        </div>

        <div className="min-w-0 self-start">
          <p className="mb-1 text-xs text-gray-500">Address</p>
          <p className="line-clamp-2 break-words text-sm text-gray-900">
            {order.userAddress.replace(/\n/g, ", ")}
          </p>
        </div>

        <div className="min-w-0 self-start">
          <p className="mb-1 text-xs text-gray-500">Date</p>
          <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
        </div>

        <div className="min-w-0 self-start">
          <p className="mb-1 text-xs text-gray-500">Items</p>
          <p className="text-sm text-gray-900">{order.items.length}</p>
        </div>

        <div className="min-w-0 self-start">
          <p className="mb-1 text-xs text-gray-500">Status</p>
          <div className="max-w-full overflow-hidden">
            <span
              className={`inline-flex max-w-full whitespace-normal break-words rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}