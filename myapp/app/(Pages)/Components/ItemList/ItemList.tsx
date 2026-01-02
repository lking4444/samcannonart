"use client"

import ItemTile from "../../Components/ItemTile";

import styles from './ItemList.module.css'

import SearchFilter from "../SearchFilter";
import { useState } from "react";
import { ItemClient } from '../../Types';


type ItemListProps = {
    items: ItemClient[]
}

export default function ItemList({items} : ItemListProps){

    const itemSizes : string[] = [
        ...new Set(
            items.map(item => item.dimensions).filter((item): item is string => item != null)
        )
    ];

    const [dimension, setDimension] = useState<string | undefined>("");
    const [keyword, setKeyword] = useState<string>("");


    return (
            <>
            <SearchFilter keyword={keyword} setKeyword={setKeyword} dimensionOptions={itemSizes} setDimension={setDimension}/>
              <div className={styles.tileContainer}>
                {items
                    .filter(item =>
                        item.name
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .includes(keyword.toLowerCase().replace(/\s+/g, ''))
                    )
                    .filter(item => item.stock > 0)
                    .filter(item =>
                        !dimension || dimension === '' || item.dimensions === dimension
                    )
                    .map(item => (
                        <ItemTile key={item.id} item={item} />
                ))}
            </div>
            </>
          
    )
}
