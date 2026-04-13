import { DisplayOrder } from "@/lib/orders";
import OrderView from "./OrderView";

const mockOrder: DisplayOrder = {
  value: "129.98",
  currency: "GBP",
  SessionId: "sess_mock_123456",

  userEmail: "jane.doe@example.com",
  userPhoneNumber: "+44 7123 456789",
  userAddress: "12 High Street\nBath\nBA1 2AB\nUnited Kingdom",

  status: "PENDING",

  paidAt: null,
  cancelledAt: null,
  refundedAt: null,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  items: [
    {
      itemId: 1,
      quantity: 2,
      unitPrice: "24.99",
      item: {
        name: "Ceramic Mug",
        imageUrl: "https://via.placeholder.com/150",
        description: "A handmade ceramic mug.",
      },
    },
    {
      itemId: 2,
      quantity: 1,
      unitPrice: "79.99",
      item: {
        name: "Desk Lamp",
        imageUrl: "https://via.placeholder.com/150",
        description: "Minimalist adjustable desk lamp.",
      },
    },
  ],
};

export default function Orders() {
  return <OrderView/>;
}