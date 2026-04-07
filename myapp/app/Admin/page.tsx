'use client'

import { useState } from "react";
import { ItemClient } from "../(Pages)/Types";
import Filter from "./Filter";
import Item from "./Item";
import ExcelUpload from "./ExcelUpload";
import Header from "../Components/Header";
import AdminHeader from "./AdminHeader";

export default function Admin() {

    // create ui for header, so type of item filtering + search + paged 
    // type, tags

    const sampleItem: ItemClient = {
        id: 1,
        name: "Birthday Blossom Card",
        type: "CARD",
        price: "3.99",
        image: "birthday-blossom-card.jpg",
        stock: 12,
        tags: ["Birthday", "Floral", "Handmade"],
        dimensions: "15x15",
        media: "Watercolour on cardstock",
        description: "A handmade birthday card with a floral watercolour design.",
        year: 2025,
    };

    const [items, setItems] = useState<ItemClient[]>([]);


    return (
        <div>
            <Filter items={items} setItems={setItems}/>
            {items.map((item) => (
                <Item key={item.id} item={item} />
            ))}
        </div>
    )
}