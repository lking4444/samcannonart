"use client";

import Select from 'react-select'
import { useState } from 'react';

import styles from './MultiSelect.module.css'

type MultiSelectProps = {
    multiSelectCategory: string;
    multiSelectOptions: string[];
}

type Option = {
    value: string;
    label: string;
  };

export default function MultiSelect({multiSelectCategory, multiSelectOptions} : MultiSelectProps){
    
    const options: Option[] = multiSelectOptions.map((str) => ({
        value: str, label: str
    }));

    const placeholder: string = multiSelectCategory + "...";

    const [selectedValues, setSelectedValues] = useState<Option | null>(null);

    const handleChange = (selected: Option | null) => {
        setSelectedValues(selected);
      };
    
    return (
        <div className={styles.selectContainer}>
            <Select
                options={options}
                placeholder={placeholder}
                value={selectedValues}
                onChange={handleChange}
                styles={{
                    control: (base, state) => ({
                    ...base,
                    borderRadius: "25px",     
                    height: "1rem",
                    padding: "0px",    
                    borderColor: state.isFocused ? "#555" : "#aaa",
                    boxShadow: "none",
                    "&:hover": {
                        borderColor: "#444",
                    },
                    whiteSpace: "nowrap",
                    }),
                    placeholder: (base) => ({
                    ...base,
                    fontWeight: "500", 
                    color: "#666",
                    }),
                    menu: (base) => ({
                        ...base,
                        borderRadius: "25px",     
                        }),
                    menuList: (base) => ({
                        ...base,
                        borderRadius: "25px",     
                        }),
                }}
            />
        </div>
    )
}