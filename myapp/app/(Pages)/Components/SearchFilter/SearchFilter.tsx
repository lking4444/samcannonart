"use client";

import styles from './SearchFilter.module.css'

import { Dispatch, SetStateAction } from "react";
import KeyWordSearch from "./KeyWordSearch";
import MultiSelect from "./MultiSelect";


type SearchFilterProps = {
    keyword: string; 
    setKeyword: Dispatch<SetStateAction<string>>;
    dimensionOptions: string[];
    setDimension: Dispatch<SetStateAction<string | undefined>>;
}

export default function SearchFilter({keyword, setKeyword, dimensionOptions, setDimension} : SearchFilterProps){

    return (
        <span className={styles.searchFilters}>
            <span className={styles.filterItem}>
                <KeyWordSearch keyword={keyword} setKeyword={setKeyword}/>
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Card Sizes" multiSelectOptions={dimensionOptions} setOptions={setDimension}/> 
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={["High to Low", "Low to High", "Default"]} setOptions={setDimension}/> 
            </span>
            <span className={styles.filterItem}>
                <MultiSelect multiSelectCategory="Card Themes" multiSelectOptions={["Love", "Friendship", "Happiness"]} setOptions={setDimension}/>
            </span>
        </span>

    )
}