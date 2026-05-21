"use client";
import {useState, Dispatch, SetStateAction, useMemo } from "react";
import Select from 'react-select'


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

    const selectId = useMemo( () => multiSelectCategory.toLowerCase().replace(/\s+/g, "-"), [multiSelectCategory] );

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
                        minHeight: "2.5rem",
                        padding: "0px 4px",
                
                        background: state.isFocused
                            ? "rgba(185, 185, 185, 0.52)"
                            : "rgba(155, 155, 155, 0.40)",
                
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                
                        borderColor: state.isFocused
                            ? "rgba(0, 0, 0, 0.70)"
                            : "rgba(100, 100, 100, 0.42)",
                
                        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.14)",
                
                        transition:
                            "background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                
                        whiteSpace: "nowrap",
                
                        "&:hover": {
                            borderColor: "rgba(0, 0, 0, 0.70)",
                            background: "rgba(185, 185, 185, 0.55)",
                            boxShadow: "0 6px 22px rgba(0, 0, 0, 0.20)",
                        },
                    }),
                
                    valueContainer: (base) => ({
                        ...base,
                        padding: "0px 12px",
                    }),
                
                    placeholder: (base) => ({
                        ...base,
                        fontWeight: "500",
                        color: "rgba(0, 0, 0, 0.52)",
                    }),
                
                    singleValue: (base) => ({
                        ...base,
                        color: "rgba(0, 0, 0, 0.88)",
                        fontWeight: "500",
                    }),
                
                    menu: (base) => ({
                        ...base,
                        borderRadius: "20px",
                        overflow: "hidden",
                
                        background: "rgba(150, 150, 150, 0.52)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                
                        border: "1px solid rgba(90, 90, 90, 0.42)",
                        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.22)",
                    }),
                
                    menuList: (base) => ({
                        ...base,
                        borderRadius: "20px",
                        padding: "6px",
                    }),
                
                    option: (base, state) => ({
                        ...base,
                        borderRadius: "14px",
                        cursor: "pointer",
                
                        background: state.isSelected
                            ? "rgba(0, 0, 0, 0.20)"
                            : state.isFocused
                            ? "rgba(255, 255, 255, 0.30)"
                            : "transparent",
                
                        color: "rgba(0, 0, 0, 0.88)",
                
                        "&:active": {
                            background: "rgba(0, 0, 0, 0.25)",
                        },
                    }),
                }}
            />
        </div>
    )
}