"use client";

import styles from "./UploadItem.module.css";
import { useState } from "react";
import { UploadClientItem } from "@/lib/types";
import TypeDetails from "./TypeDetails";
import ImageUpload from "../ImageUpload";

type ItemProps = {
  item: UploadClientItem;
  selectedFile: File | null;
  onItemChange: (item: UploadClientItem) => void;
  onFileChange: (uploadId: number, file: File | null) => void;
  onReset: (uploadId: number) => void;
  onSaved: (uploadId: number) => void;
};

async function save(
  item: UploadClientItem,
  selectedFile: File | null,
  onSaved: (uploadId: number) => void
) {
  if (!selectedFile) {
    throw new Error("Please select an image before saving.");
  }

  if (selectedFile.name !== item.image) {
    throw new Error(
      `Image filename mismatch. Expected "${item.image}", got "${selectedFile.name}".`
    );
  }

  const imageId = item.image.replace(/\.[^.]+$/, "");

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("itemType", item.type);
  formData.append("imageId", imageId);

  const uploadResponse = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const response = await fetch("/Admin/api/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to save item");
  }

  onSaved(item.uploadId);
}

export default function UploadItem({
  item,
  selectedFile,
  onItemChange,
  onFileChange,
  onReset,
  onSaved,
}: ItemProps) {
  const [showTagsEditor, setShowTagsEditor] = useState(false);

  const updateTag = (index: number, value: string) => {
    onItemChange({
      ...item,
      tags: item.tags.map((tag, i) => (i === index ? value : tag)),
    });
  };

  const addTag = () => {
    onItemChange({
      ...item,
      tags: [...item.tags, ""],
    });
  };

  const removeTag = (index: number) => {
    onItemChange({
      ...item,
      tags: item.tags.filter((_, i) => i !== index),
    });
  };

  const normaliseTags = () => {
    onItemChange({
      ...item,
      tags: item.tags.map((t) => t.trim()).filter(Boolean),
    });
    setShowTagsEditor(false);
  };

  return (
    <div className={styles.row}>
      <ImageUpload
        onFileSelect={(file) => onFileChange(item.uploadId, file)}
        item={item}
      />

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Name</label>
        <input
          type="text"
          placeholder={item.name}
          className={styles.keywordSearch}
          value={item.name}
          onChange={(e) =>
            onItemChange({
              ...item,
              name: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Price</label>
        <input
          type="text"
          placeholder={item.price}
          className={styles.keywordSearch}
          value={item.price}
          onChange={(e) =>
            onItemChange({
              ...item,
              price: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Description</label>
        <input
          type="text"
          placeholder={item.description ?? ""}
          className={styles.keywordSearch}
          value={item.description ?? ""}
          onChange={(e) =>
            onItemChange({
              ...item,
              description: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Dimensions</label>
        <input
          type="text"
          placeholder={item.dimensions ?? ""}
          className={styles.keywordSearch}
          value={item.dimensions ?? ""}
          onChange={(e) =>
            onItemChange({
              ...item,
              dimensions: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Media</label>
        <input
          type="text"
          placeholder={item.media ?? ""}
          className={styles.keywordSearch}
          value={item.media ?? ""}
          onChange={(e) =>
            onItemChange({
              ...item,
              media: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Stock</label>
        <input
          type="text"
          placeholder={String(item.stock)}
          className={styles.keywordSearch}
          value={String(item.stock)}
          onChange={(e) =>
            onItemChange({
              ...item,
              stock: Number(e.target.value),
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Image</label>
        <input
          type="text"
          placeholder={item.image}
          className={styles.keywordSearch}
          value={item.image}
          onChange={(e) =>
            onItemChange({
              ...item,
              image: e.target.value,
            })
          }
        />
      </span>

      <span className={styles.field}>
        <label className={styles.fieldLabel}>Year</label>
        <input
          type="text"
          placeholder={String(item.year ?? "")}
          className={styles.keywordSearch}
          value={item.year ?? ""}
          onChange={(e) =>
            onItemChange({
              ...item,
              year: e.target.value === "" ? null : Number(e.target.value),
            })
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
          Tags ({item.tags.length})
        </button>

        {showTagsEditor && (
          <div className={styles.tagsEditorDropdown}>
            <div className={styles.tagsEditorList}>
              {item.tags.map((tag, index) => (
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

      <TypeDetails item={item} />

      <button
        className={styles.saveButton}
        onClick={() => save(item, selectedFile, onSaved)}
      >
        Save
      </button>

      <button
        className={styles.resetButton}
        onClick={() => onReset(item.uploadId)}
      >
        Reset
      </button>
    </div>
  );
}