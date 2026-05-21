"use client";
import { useEffect, useRef, useState } from "react";

import { UploadClientItem } from "@/app/Types/upload";

import styles from "./ImageUpload.module.css";

type ImageUploadSquareProps = {
    item: UploadClientItem;
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
};

export default function ImageUpload({ item, onFileSelect, disabled = false, }: ImageUploadSquareProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFile = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }

        if (previewUrl) { URL.revokeObjectURL(previewUrl); }

        const nextPreviewUrl = URL.createObjectURL(file);
        const filename = file.name.replace(/\.jpg$/i, "");

        setSelectedFileName(filename);
        setPreviewUrl(nextPreviewUrl);
        onFileSelect(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        handleFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;

        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] ?? null;
        handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const clearSelectedImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (previewUrl) { URL.revokeObjectURL(previewUrl); }

        setPreviewUrl(null);
        setSelectedFileName(null);
        onFileSelect(null);

        if (inputRef.current) { inputRef.current.value = ""; }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const isMatch = selectedFileName ? selectedFileName === item.image : null;

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <button
                    type="button"
                    onClick={openFilePicker}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    disabled={disabled}
                    className={[
                        styles.uploadButton,
                        disabled ? styles.uploadButtonDisabled : styles.uploadButtonEnabled,
                        isDragging ? styles.uploadButtonDragging : styles.uploadButtonIdle,
                    ].join(" ")}
                    aria-label="Upload image"
                >
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt={selectedFileName ?? "Selected image preview"}
                                className={styles.previewImage}
                            />
                            <div className={styles.previewOverlay}>
                                <span className={styles.previewOverlayText}>Change image</span>
                            </div>
                        </>
                    ) : ( <span className={styles.plusIcon}>+</span> )}
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

            <div className={styles.details}>
                <div>
                    <span className={styles.label}>Expected file name:</span>{" "}
                    <span>{item.image || "No expected file name"}</span>
                </div>
                {selectedFileName && (
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Selected file:</span>{" "}
                        <span>{selectedFileName}</span>
                    </div>
                )}
                {isMatch === false && (
                    <div className={styles.errorMessage}>
                        Selected file does not match the expected file name.
                    </div>
                )}
                {isMatch === true && (
                    <div className={styles.successMessage}>File name matches.</div>
                )}
            </div>
        </div>
    );
}