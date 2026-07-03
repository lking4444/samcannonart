type FetchAdminItemsParams = {
    page: number;
    PAGE_SIZE: number;
    keyword: string;
    type: string;
    tag: string;
  };

export async function fetchItemTags(): Promise<string[]> {
    const res = await fetch("/Admin/api/items/tags", { cache: "no-store", });
  
    if (!res.ok) { throw new Error("Failed to load tags"); }
  
    const data = await res.json();
    return data.tags ?? [];
}

export async function fetchAdminItems({ page, PAGE_SIZE, keyword, type, tag, }: FetchAdminItemsParams) {
    const sp = new URLSearchParams();

    sp.set("page", String(page));
    sp.set("pageSize", String(PAGE_SIZE));

    if (keyword.trim()) { sp.set("keyword", keyword.trim()); }
    if (type !== "Default") { sp.set("type", type); }
    if (tag !== "Default") { sp.set("tag", tag); }

    const res = await fetch(`/Admin/api/items?${sp.toString()}`, { cache: "no-store", });
    const data = await res.json();

    if (!res.ok) { throw new Error(data.error ?? "Failed to load items"); }

    return data;
}