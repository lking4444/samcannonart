'use client'

import { useRef, useState } from "react";

import { bulkImageUpload, getImageIdFromFileName } from "@/lib/images/uploads";

import { ITEM_TYPE, ItemType } from "@/app/Types/items";
import { SelectedImage, UploadImageInput } from "@/app/Types/upload";

import styles from "./ImageUpload.module.css";

export default function ImageUpload() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [itemType, setItemType] = useState<ITEM_TYPE>(ItemType.ORIGINAL);
    const [isDragging, setIsDragging] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    function addFiles(files: FileList | File[]) {
        const imageFiles = Array.from(files).filter((file) =>
         file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
            setError("Please select valid image files.");
            return;
        }

        setSelectedImages((currentImages) => {
            const existingKeys = new Set(
                currentImages.map(
                (image) =>
                    `${image.file.name}-${image.file.size}-${image.file.lastModified}`
                )
        );

        const newImages = imageFiles
            .filter(
                (file) =>
                    !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
            )
            .map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                imageId: getImageIdFromFileName(file.name),
            }));

        return [...currentImages, ...newImages];
        });

        setError(null);
        setSuccessMessage(null);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;

        addFiles(event.target.files);

        event.target.value = "";
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);

        if (!event.dataTransfer.files) return;

        addFiles(event.dataTransfer.files);
    }

    function removeImage(indexToRemove: number) {
        setSelectedImages((currentImages) => {
        const imageToRemove = currentImages[indexToRemove];

        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }

        return currentImages.filter((_, index) => index !== indexToRemove);
        });
    }

    function clearImages() {
        selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        setSelectedImages([]);
    }

    async function handleSave() {
        if (selectedImages.length === 0) {
            setError("Please select at least one image.");
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const images: UploadImageInput[] = selectedImages.map((image) => ({
                file: image.file,
                itemType,
                imageId: image.imageId,
        }));

        await bulkImageUpload(images);

        clearImages();
        setSuccessMessage("Images saved successfully.");
        } catch (saveError) {
            setError(
                saveError instanceof Error
                ? saveError.message
                : "Failed to save images."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={styles.wrapper}>
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className={styles.hiddenInput}
        />

        <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
                inputRef.current?.click();
            }
            }}
        >
            <div className={styles.icon}>🖼️</div>
            <h2 className={styles.title}>Upload Images</h2>
            <p className={styles.text}>Drag and drop your image files here</p>
            <p className={styles.subtext}>or click to browse</p>
        </div>

        <div className={styles.field}>
            <label htmlFor="itemType" className={styles.label}>
            Image type
            </label>

            <select
            id="itemType"
            value={itemType}
            onChange={(event) => setItemType(event.target.value as ITEM_TYPE)}
            className={styles.select}
            disabled={isSaving}
            >
            {Object.values(ItemType).map((type) => (
                <option key={type} value={type}>
                {type}
                </option>
            ))}
            </select>
        </div>

        {selectedImages.length > 0 && (
            <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
                <div>
                <h3 className={styles.previewTitle}>Selected images</h3>
                <p className={styles.previewCount}>
                    {selectedImages.length} image
                    {selectedImages.length === 1 ? "" : "s"} selected
                </p>
                </div>

                <button
                type="button"
                onClick={clearImages}
                className={styles.clearButton}
                disabled={isSaving}
                >
                Clear all
                </button>
            </div>

            <div className={styles.imageGrid}>
                {selectedImages.map((image, index) => (
                <div
                    key={`${image.file.name}-${image.file.size}-${image.file.lastModified}`}
                    className={styles.imageCard}
                >
                    <div className={styles.imagePreviewWrapper}>
                    <img
                        src={image.previewUrl}
                        alt={image.file.name}
                        className={styles.imagePreview}
                    />
                    </div>

                    <div className={styles.imageInfo}>
                    <span className={styles.imageName}>{image.file.name}</span>
                    <span className={styles.imageId}>
                        ID: {image.imageId}
                    </span>
                    <span className={styles.imageType}>
                        Type: {itemType}
                    </span>
                    </div>

                    <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles.removeButton}
                    disabled={isSaving}
                    >
                    Remove
                    </button>
                </div>
                ))}
            </div>
            </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <button
            type="button"
            onClick={handleSave}
            disabled={selectedImages.length === 0 || isSaving}
            className={styles.saveButton}
        >
            {isSaving ? "Saving..." : "Save Images"}
        </button>
        </div>
    );
}