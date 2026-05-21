'use client'

import { useState } from "react";

import Filter from "./Filter";
import Item from "./Item";
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
            {items.map((item) => (
                <Item key={item.id} item={item} removeItem={removeItemFromList}/>
            ))}
        </div>
    )
}