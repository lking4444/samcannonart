'use client'

import { useState } from "react";
import { ItemClient } from "../(Pages)/Types";
import Filter from "./Filter";
import Item from "./Item";

export default function Admin() {

    // create ui for header, so type of item filtering + search + paged 
    // type, tags

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