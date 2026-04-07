"use client";

import styles from "./Item.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ItemClientWithTypes } from "../../(Pages)/Types";
import TypeDetails from "./TypeDetails";


type ItemProps = {
  item: ItemClientWithTypes;
};

function save(
  setOriginalItem: Dispatch<SetStateAction<ItemClientWithTypes>>,
  newItem: ItemClientWithTypes
) {
  setOriginalItem(newItem);
  // call update item api
}

function reset(
  setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>,
  originalItem: ItemClientWithTypes
) {
  setModifiedItem(originalItem);
}

export default function Item({ item }: ItemProps) {
  const [modifiedItem, setModifiedItem] = useState<ItemClientWithTypes>(item);
  const [originalItem, setOriginalItem] = useState<ItemClientWithTypes>(item);
  const [showTagsEditor, setShowTagsEditor] = useState(false);

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
  };

  return (
    <div className={styles.row}>
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
    <TypeDetails item={modifiedItem}/>
    <button className={styles.saveButton} onClick={() => save(setOriginalItem, modifiedItem)}>
        Save
    </button>
    <button className={styles.resetButton} onClick={() => reset(setModifiedItem, originalItem)}>
        Reset
    </button>
    </div>
  );
}