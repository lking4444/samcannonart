"use client"
import { useState } from "react";

import ItemTile from "../../Components/ItemTile";
import { ItemClient } from '../../Types';

import styles from './ItemList.module.css'

type ItemListProps = {
    items: ItemClient[]
}

export default function ItemList({ items }: ItemListProps) {
    const itemSizes: string[] = [
      ...new Set(items.map((item) => item.dimensions).filter((d): d is string => d != null)),
    ];
  
    const [dimension, setDimension] = useState<string | undefined>("");
    const [keyword, setKeyword] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string | undefined>("");
    
  
    const filteredAndSorted = items
      .filter((item) =>
        item.name.toLowerCase().replace(/\s+/g, "").includes(keyword.toLowerCase().replace(/\s+/g, ""))
      )
      .filter((item) => item.stock > 0)
      .filter((item) => !dimension || dimension === "" || item.dimensions === dimension)
      .slice()
      .sort((a, b) => {
        if (sortOrder === "High to Low") return Number(b.price )- Number(a.price);
        if (sortOrder === "Low to High") return Number(a.price) - Number(b.price);
        return 0;
      });
  
    return (
      <>
        {/* <SearchFilter
          keyword={keyword}
          setKeyword={setKeyword}
          dimensionOptions={itemSizes}
          setDimension={setDimension}
          sortOrder={sortOrders}
          setSortOrder={setSortOrder}
        /> */}
        <div className={styles.tileContainer}>
          {filteredAndSorted.map((item) => (
            <ItemTile key={item.id} item={item} />
          ))}
        </div>
      </>
    );
  }
