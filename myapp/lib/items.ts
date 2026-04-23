import { ItemClient } from "@/app/(Pages)/Types";

type ApiResponse = {
    items: any[];
}
  
export async function getSuggestedContent(id: string) {
    const sp = new URLSearchParams();
    sp.set("id", String(id));
    const url = `/api/items/recommendations?${sp.toString()}`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch suggested content");
    }
  
    const data: ApiResponse = await response.json();
  
    const items: ItemClient[] = data.items.map((item) => ({
      ...item,
      price: item.price.toString(),
    }));
  
    return items;
}
  