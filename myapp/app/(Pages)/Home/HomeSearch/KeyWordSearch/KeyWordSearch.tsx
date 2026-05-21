"use client";
import {Dispatch, SetStateAction } from "react";
import Image from "next/image";

import styles from './KeyWordSearch.module.css'

type KeyWordSearchProps = {
    keyword: string; 
    setKeyword: Dispatch<SetStateAction<string>>;
}

export default function KeyWordSearch({keyword, setKeyword} : KeyWordSearchProps){

    return (
        <div className={styles.searchContainer}>
            <Image   
                src="/icons/search.svg"
                alt="Search"
                width={24}
                height={24}
                className={styles.searchIcon}
            />
            <input 
                type='text' 
                placeholder="Search..."
                className={styles.keywordSearch}
                value={keyword}
                onChange={(e) => {setKeyword(e.target.value)}}
            />
        </div>
    )
}