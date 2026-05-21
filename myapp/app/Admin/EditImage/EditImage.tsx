"use client";
import { ChangeEvent, DragEvent, MouseEvent, useEffect, useRef, useState, } from "react";

import { ItemClientWithTypes } from "@/app/Types/items";
import { getItemImageSrc } from "@/lib/images/imagepaths";

import styles from "./EditImage.module.css";

type ImageUploadSquareProps = {
    item: ItemClientWithTypes;
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
};

export default function EditImage({ item, onFileSelect, disabled = false, }: ImageUploadSquareProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);

    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const existingImageUrl = item.image ? getItemImageSrc(item.type, item.image) : null;

    const displayedImageUrl = previewUrl ?? existingImageUrl;

    const handleFile = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }

        if (previewUrl) { URL.revokeObjectURL(previewUrl); }

        const nextPreviewUrl = URL.createObjectURL(file);

        setSelectedFileName(file.name);
        setPreviewUrl(nextPreviewUrl);
        onFileSelect(file);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        handleFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;

        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] ?? null;
        handleFile(file);
    };

    const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const clearSelectedImage = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (previewUrl) { URL.revokeObjectURL(previewUrl); }

        setPreviewUrl(null);
        setSelectedFileName(null);
        onFileSelect(null);

        if (inputRef.current) { inputRef.current.value = ""; }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) { URL.revokeObjectURL(previewUrl); }
        };
    }, [previewUrl]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.imageWrapper}>
                <button
                    type="button"
                    onClick={openFilePicker}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    disabled={disabled}
                    className={[ styles.uploadButton, disabled ? styles.disabled : styles.enabled, isDragging ? styles.dragging : styles.notDragging, ].join(" ")}
                    aria-label="Upload image"
                >
                    {displayedImageUrl ? (
                        <>
                            <img
                                src={displayedImageUrl}
                                alt={selectedFileName ?? item.image ?? "Image preview"}
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <span className={styles.overlayText}>Change image</span>
                            </div>
                        </>
                    ) : (
                        <span className={styles.plusIcon}>+</span>
                    )}
                </button>

                {previewUrl && !disabled && (
                    <button
                        type="button"
                        onClick={clearSelectedImage}
                        className={styles.removeButton}
                        aria-label="Remove selected image"
                    >
                        ×
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className={styles.hiddenInput}
                disabled={disabled}
            />
        </div>
    );
}