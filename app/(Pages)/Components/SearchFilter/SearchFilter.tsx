"use client";
import { Dispatch, SetStateAction } from "react";

import KeyWordSearch from "../KeyWordSearch";
import MultiSelect from "./MultiSelect";
import FilterDropDown from './FilterDropDown';

import styles from './SearchFilter.module.css'

type SearchFilterProps = {
    keyword: string; 
    setKeyword: Dispatch<SetStateAction<string>>;
    dimensionOptions: string[];
    setDimension: Dispatch<SetStateAction<string | undefined>>;
    tagOptions: string[];
    setTag: Dispatch<SetStateAction<string | undefined>>;
    sortOrder: string[]; 
    setSortOrder: Dispatch<SetStateAction<string | undefined>>;
}

export default function SearchFilter({keyword, setKeyword, dimensionOptions, setDimension, tagOptions, setTag, sortOrder, setSortOrder} : SearchFilterProps){

    return (
        <span className={styles.searchFilters}>
            <span className={styles.container}>
                <span className={styles.filterItem}>
                    <KeyWordSearch keyword={keyword} setKeyword={setKeyword}/>
                </span>
                <span className={styles.FilterDropDown}>
                    <FilterDropDown dimensionOptions={dimensionOptions} setDimension={setDimension} sortOrder={sortOrder} setSortOrder={setSortOrder} tagOptions={tagOptions} setTag={setTag}/>
                </span>
            </span>
            <span className={styles.selectable}>
                <MultiSelect multiSelectCategory="Filter Sizes" multiSelectOptions={dimensionOptions} setOptions={setDimension}/> 
            </span>
            <span className={styles.selectable}>
                <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={sortOrder} setOptions={setSortOrder}/> 
            </span>
            <span className={styles.selectable}>
                <MultiSelect multiSelectCategory="Filter Themes" multiSelectOptions={tagOptions} setOptions={setTag}/>
            </span>
        </span>

    )
}