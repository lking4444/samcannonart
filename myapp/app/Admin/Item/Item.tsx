"use client";

import { useState } from "react";

import TypeDetails from "./TypeDetails";
import EditImage from "../EditImage";
import { ItemClientWithTypes } from "@/app/Types/items";

import styles from "./Item.module.css";
import { handleDelete, handleReset, handleSave } from "@/lib/stock/item";

type ItemProps = {
    item: ItemClientWithTypes;
    removeItem: (id: number) => void;
};

export default function Item({ item, removeItem }: ItemProps) {
    const [modifiedItem, setModifiedItem] = useState<ItemClientWithTypes>(item);
    const [originalItem, setOriginalItem] = useState<ItemClientWithTypes>(item);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showTagsEditor, setShowTagsEditor] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const updateTag = (index: number, value: string) => {
        setModifiedItem((current) => ({
            ...current,
            tags: current.tags.map((tag, i) => (i === index ? value : tag)),
        }));
    };

    const addTag = () => {
        setModifiedItem((current) => ({
            ...current,
            tags: [...current.tags, ""],
        }));
    };

    const removeTag = (index: number) => {
        setModifiedItem((current) => ({
            ...current,
            tags: current.tags.filter((_, i) => i !== index),
        }));
    };

    const normaliseTags = () => {
        setModifiedItem((current) => ({
            ...current,
            tags: current.tags.map((t) => t.trim()).filter(Boolean),
        }));

        setShowTagsEditor(false);
    };

    const togglePopular = () => {
        setModifiedItem((current) => ({
            ...current,
            popular: !current.popular,
        }));
    };

    const toggleHidden = () => {
        setModifiedItem((current) => ({
            ...current,
            hidden: !current.hidden,
        }));
    };

    return (
        <div className={styles.rowWrapper}>
            <div className={styles.row}>
                <EditImage
                    item={modifiedItem}
                    onFileSelect={(file) => {
                        setSelectedFile(file);
                        if (file) {
                            const imageId = file.name.replace(/\.[^.]+$/, "");

                            setModifiedItem((current) => ({
                                ...current,
                                image: imageId,
                            }));
                        }
                    }}
                />

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Name</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.name}
                        className={styles.keywordSearch}
                        value={modifiedItem.name}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                name: e.target.value,
                            }))
                        }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Price</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.price}
                        className={styles.keywordSearch}
                        value={modifiedItem.price}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                price: e.target.value,
                            }))
                        }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Description</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.description ?? ""}
                        className={styles.keywordSearch}
                        value={modifiedItem.description ?? ""}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                description: e.target.value,
                            }))
                    }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Dimensions</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.dimensions ?? ""}
                        className={styles.keywordSearch}
                        value={modifiedItem.dimensions ?? ""}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                dimensions: e.target.value,
                            }))
                        }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Media</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.media ?? ""}
                        className={styles.keywordSearch}
                        value={modifiedItem.media ?? ""}
                        onChange={(e) =>
                                setModifiedItem((item) => ({
                                    ...item,
                                    media: e.target.value,
                            }))
                        }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Stock</label>
                    <input
                        type="text"
                        placeholder={String(modifiedItem.stock)}
                        className={styles.keywordSearch}
                        value={String(modifiedItem.stock)}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                stock: Number(e.target.value),
                            }))
                        }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Image</label>
                    <input
                        type="text"
                        placeholder={modifiedItem.image}
                        className={styles.keywordSearch}
                        value={modifiedItem.image}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                image: e.target.value,
                            }))
                    }
                    />
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Year</label>
                    <input
                        type="text"
                        placeholder={String(modifiedItem.year ?? "")}
                        className={styles.keywordSearch}
                        value={modifiedItem.year ?? ""}
                        onChange={(e) =>
                            setModifiedItem((item) => ({
                                ...item,
                                year: e.target.value === "" ? null : Number(e.target.value),
                            }))
                    }
                    />
                </span>

                <span className={`${styles.field} ${styles.tagsEditorWrapper}`}>
                    <label className={styles.fieldLabel}>Tags</label>
                    <button
                        type="button"
                        className={styles.tagsEditorButton}
                        onClick={() => setShowTagsEditor((prev) => !prev)}
                    >
                        Tags ({modifiedItem.tags.length})
                    </button>

                    {showTagsEditor && (
                        <div className={styles.tagsEditorDropdown}>
                            <div className={styles.tagsEditorList}>
                                {modifiedItem.tags.map((tag, index) => (
                                    <div key={index} className={styles.tagEditorRow}>
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => updateTag(index, e.target.value)}
                                            className={styles.keywordSearch}
                                        />
                                        <button
                                            type="button"
                                            className={styles.tagActionButton}
                                            onClick={() => removeTag(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className={styles.tagActionButton}
                                    onClick={addTag}
                                >
                                    Add tag
                                </button>

                                <button
                                    type="button"
                                    className={styles.tagActionButton}
                                    onClick={normaliseTags}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Popular</label>
                    <button
                        type="button"
                        onClick={togglePopular}
                        className={`${styles.popularButton} ${
                            modifiedItem.popular ? styles.popularActive : styles.popularInactive
                        }`}
                    >
                        {modifiedItem.popular ? "★ Popular" : "☆ Not popular"}
                    </button>
                </span>

                <span className={styles.field}>
                    <label className={styles.fieldLabel}>Hidden</label>
                    <button
                        type="button"
                        onClick={toggleHidden}
                        className={`${styles.popularButton} ${
                            modifiedItem.hidden ? styles.popularActive : styles.popularInactive
                        }`}
                    >
                        {modifiedItem.hidden ? "★ Hidden" : "☆ Not Hidden"}
                    </button>
                </span>

                <TypeDetails item={modifiedItem} />

            
            </div>
            <div className={styles.actionWrapper}>
                <button
                    className={`${styles.saveButton} ${
                        isSaving ? styles.saveButtonSaving : ""
                    } ${saveSuccess ? styles.saveButtonSuccess : ""}`}
                    onClick={() =>
                        handleSave({
                        setIsSaving,
                        setSaveSuccess,
                        setOriginalItem,
                        setModifiedItem,
                        setSelectedFile,
                        modifiedItem,
                        selectedFile,
                        })
                    }
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
                </button>
                <button
                    className={styles.resetButton}
                    onClick={() =>
                        handleReset({
                        setModifiedItem,
                        setSelectedFile,
                        originalItem,
                        })
                    }
                >
                    Reset
                </button>
                <button
                    type="button"
                    className={`${styles.deleteButton} ${
                        isDeleting ? styles.deleteButtonDeleting : ""
                    } ${deleteSuccess ? styles.deleteButtonSuccess : ""}`}
                    onClick={() =>
                        handleDelete({
                        originalItem,
                        removeItem,
                        setIsDeleting,
                        setDeleteSuccess,
                        })
                    }
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : deleteSuccess ? "Deleted!" : "Delete"}
                </button>
            </div>
        </div>
    );
}