import { Dispatch, SetStateAction, useState } from "react";
import Image from 'next/image';

import MultiSelect from "./../MultiSelect";

import styles from './FilterDropDown.module.css'

type FilterDropDownProps = {
    dimensionOptions: string[];
    setDimension: Dispatch<SetStateAction<string | undefined>>;
    sortOrder: string[]; 
    setSortOrder: Dispatch<SetStateAction<string | undefined>>;
    tagOptions: string[]; 
    setTag: Dispatch<SetStateAction<string | undefined>>;
}

export default function FilterDropDown({dimensionOptions, setDimension, sortOrder, setSortOrder, tagOptions, setTag}: FilterDropDownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={styles.container}>
        <div className={styles.dropdownAnchor}>
          <button className={styles.filterButton} onClick={() =>setIsOpen(prev => !prev)}>
            <p>Filter</p>
            <Image   
              src="/icons/filter.svg"
              alt="Left"
              width={24}
              height={24}
              className={styles.card}
            />
          </button>
          {isOpen && (
            <div className={`${styles.filterContainer} ${ isOpen ? styles.filterOpen : styles.filterClosed }`}>
              <MultiSelect multiSelectCategory="Filter Sizes" multiSelectOptions={dimensionOptions} setOptions={setDimension}/>
              <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={sortOrder} setOptions={setSortOrder}/>
              <MultiSelect multiSelectCategory="Filter Themes" multiSelectOptions={tagOptions} setOptions={setTag}/>
            </div>
          )}
        </div>
      </div>
    );
}