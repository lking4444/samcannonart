"use client";

import styles from './SearchFilter.module.css'

import {useState} from "react";
import KeyWordSearch from "./KeyWordSearch";
import MultiSelect from "./MultiSelect";

export default function SearchFilter(){

    const [keyword, setKeyword] = useState<string>("");

    return (
        <span className={styles.searchFilters}>
            <span className={styles.filterItem}>
                <KeyWordSearch keyword={keyword} setKeyword={setKeyword}/>
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Card Sizes" multiSelectOptions={["32x32", "16x16", "All"]}/> 
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={["High to Low", "Low to High", "Default"]}/> 
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Card Themes" multiSelectOptions={["Love", "Friendship", "Happiness"]}/>
            </span>
        </span>

    )
}