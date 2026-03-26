"use client";

import Select from 'react-select'
import {useState, Dispatch, SetStateAction, useMemo } from "react";

import styles from './MultiSelect.module.css'

type MultiSelectProps = {
    multiSelectCategory: string;
    multiSelectOptions: string[];
    setOptions: Dispatch<SetStateAction<string | undefined>>;
}

type Option = {
    value: string;
    label: string;
  };

export default function MultiSelect({multiSelectCategory, multiSelectOptions, setOptions} : MultiSelectProps){

    const options: Option[] = multiSelectOptions.map((str) => ({
        value: str, label: str
    }));

    const placeholder: string = multiSelectCategory + "...";

    const [selectedValues, setSelectedValues] = useState<Option | null>(null);

    const selectId = useMemo(
        () => multiSelectCategory.toLowerCase().replace(/\s+/g, "-"),
        [multiSelectCategory]
      );

    const handleChange = (selected: Option | null) => {
        setSelectedValues(selected);
        setOptions(selected?.label)
      };
    
    return (
        <div className={styles.selectContainer}>
            <Select
                instanceId={selectId}
                inputId={`${selectId}-input`}
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
                    transition: "background-color 0.2s ease, transform 0.15s ease",
                    boxShadow: "none",
                    "&:hover": {
                        borderColor: "#444",
                        backgroundColor: "#f5f5f5"
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