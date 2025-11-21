"use client";

import { useState } from 'react';

import styles from './KeyWordSearch.module.css'

export default function KeyWordSearch(){

    const [keyword, setKeyword] = useState<string>("");

    return (
        <div>
            <input 
                type='text' 
                className={styles.keywordSearch}
                value={keyword}
                onChange={(e) => {setKeyword(e.target.value)}}
            />
            {keyword}
        </div>
    )
}