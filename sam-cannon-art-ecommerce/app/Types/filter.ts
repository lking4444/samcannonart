import { Dispatch, SetStateAction } from "react";

import { ItemClient } from "./items";

export type AdminItemsResponse = {
    items: ItemClient[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    error?: string;
};
  
export type TagsResponse = {
    tags: string[];
    error?: string;
};
