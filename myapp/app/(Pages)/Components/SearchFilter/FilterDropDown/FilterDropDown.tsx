import styles from './FilterDropDown.module.css'

import { Dispatch, SetStateAction, useState } from "react";
import KeyWordSearch from "../../KeyWordSearch";
import MultiSelect from "./../MultiSelect";
import Image from 'next/image';

type FilterDropDownProps = {
    dimensionOptions: string[];
    setDimension: Dispatch<SetStateAction<string | undefined>>;
    sortOrder: string[]; 
    setSortOrder: Dispatch<SetStateAction<string | undefined>>;
}


export default function FilterDropDown({dimensionOptions, setDimension, sortOrder, setSortOrder,}: FilterDropDownProps) {
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
          <div   className={`${styles.filterContainer} ${
            isOpen ? styles.filterOpen : styles.filterClosed
          }`}>
            <MultiSelect multiSelectCategory="Card Sizes" multiSelectOptions={dimensionOptions} setOptions={setDimension}/>
            <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={sortOrder} setOptions={setSortOrder}/>
            <MultiSelect multiSelectCategory="Card Themes" multiSelectOptions={["Love", "Friendship", "Happiness"]} setOptions={setDimension}/>
          </div>)}
        </div>
      </div>
    );
  }