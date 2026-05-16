"use client";

import { Dispatch, SetStateAction, useState } from "react";

import TypeDetails from "./TypeDetails";
import EditImage from "../EditImage";
import { ItemClientWithTypes } from "@/app/Types/items";

import styles from "./Item.module.css";

type ItemProps = {
  item: ItemClientWithTypes;
  removeItem: (id: number) => void;
};

async function save(
    setOriginalItem: Dispatch<SetStateAction<ItemClientWithTypes>>,
    setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>,
    setSelectedFile: Dispatch<SetStateAction<File | null>>,
    newItem: ItemClientWithTypes,
    selectedFile: File | null
) {
    if (selectedFile) {
        const expectedFileName = newItem.image?.split("/").pop() ?? newItem.image;

        const selectedFileName = selectedFile.name.replace(/\.jpg$/i, "");

        if (expectedFileName && selectedFileName !== expectedFileName) {
        throw new Error(
            `Image filename mismatch. Expected "${expectedFileName}", got "${selectedFileName}".`
        );
        }

        const imageId = expectedFileName.replace(/\.[^.]+$/, "");

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("itemType", newItem.type);
        formData.append("imageId", imageId);

        const uploadResponse = await fetch("/Admin/api/images/single", {
            method: "POST",
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
        }
    }

    const response = await fetch(`/Admin/api/items/${newItem.id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name: newItem.name,
        price: newItem.price,
        description: newItem.description,
        dimensions: newItem.dimensions,
        media: newItem.media,
        stock: newItem.stock,
        image: newItem.image,
        year: newItem.year,
        popular: newItem.popular,
        hidden: newItem.hidden,
        tags: newItem.tags,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to save item");
    }

    const updatedItem = await response.json();

    setOriginalItem(updatedItem);
    setModifiedItem(updatedItem);
    setSelectedFile(null);
}

async function deleteItem(itemId: number) {
    const response = await fetch(`/Admin/api/items/delete/${itemId}`, {
        method: "DELETE",
    });
  
    if (!response.ok) {
        const data = await response.json().catch(() => null);
    
        throw new Error(data?.error ?? "Failed to delete item");
    }
}

function reset( setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>, setSelectedFile: Dispatch<SetStateAction<File | null>>, originalItem: ItemClientWithTypes ) {
  setModifiedItem(originalItem);
  setSelectedFile(null);
}

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
            <button className={`${styles.saveButton} ${ isSaving ? styles.saveButtonSaving : "" } ${saveSuccess ? styles.saveButtonSuccess : ""}`}
            onClick={async () => {
            try {
                setIsSaving(true);
                setSaveSuccess(false);

                await save(
                setOriginalItem,
                setModifiedItem,
                setSelectedFile,
                modifiedItem,
                selectedFile
                );

                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 1200);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSaving(false);
            }
            }}
            disabled={isSaving}
            >
                {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
            </button>

            <button className={styles.resetButton} onClick={() => reset(setModifiedItem, setSelectedFile, originalItem)} >
                Reset
            </button>

            <button type="button" className={`${styles.deleteButton} ${ isDeleting ? styles.deleteButtonDeleting : "" } ${deleteSuccess ? styles.deleteButtonSuccess : ""}`}
                onClick={async () => {
                    const confirmed = window.confirm( `Are you sure you want to delete "${originalItem.name}"?` );

                    if (!confirmed) return;

                    try {
                        setIsDeleting(true);
                        setDeleteSuccess(false);

                        await deleteItem(originalItem.id);

                        setDeleteSuccess(true);
                        removeItem(originalItem.id);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setIsDeleting(false);
                    }
                }}
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : deleteSuccess ? "Deleted!" : "Delete"}
            </button>
        </div>
    </div>
  );
}