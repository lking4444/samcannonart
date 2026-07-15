'use client'
import { useState } from "react";

import Filter from "./Components/Filter";
import Item from "./Components/Item";
import { ItemClient } from "../Types/items";

export default function Admin() {
    const [items, setItems] = useState<ItemClient[]>([]);

    const removeItemFromList = (id: number) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== id)
        );
    };

    return (
        <div>
            <Filter items={items} setItems={setItems}/>
        </div>
    )
}