"use client";

import { ItemClientWithTypes } from "@/app/(Pages)/Types";
import { getItemImageSrc } from "@/lib/imagepaths";
import { useEffect, useRef, useState } from "react";

type ImageUploadSquareProps = {
  item: ItemClientWithTypes;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
};

export default function EditImage({
  item,
  onFileSelect,
  disabled = false,
}: ImageUploadSquareProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const existingImageUrl = item.image
    ? getItemImageSrc(item.type, item.image)
    : null;

  const displayedImageUrl = previewUrl ?? existingImageUrl;

  const handleFile = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setSelectedFileName(file.name);
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

    if (!disabled) setIsDragging(true);
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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFileName(null);
    onFileSelect(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-fit">
        <button
          type="button"
          onClick={openFilePicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={disabled}
          className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-dashed transition ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${
            isDragging
              ? "border-black bg-gray-100"
              : "border-gray-400 bg-white hover:bg-gray-50"
          }`}
          aria-label="Upload image"
        >
          {displayedImageUrl ? (
            <>
              <img
                src={displayedImageUrl}
                alt={selectedFileName ?? item.image ?? "Image preview"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/30 hover:opacity-100">
                <span className="rounded bg-black/50 px-2 py-1 text-xs">
                  Change image
                </span>
              </div>
            </>
          ) : (
            <span className="text-4xl text-gray-600">+</span>
          )}
        </button>

        {previewUrl && !disabled && (
          <button
            type="button"
            onClick={clearSelectedImage}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-white shadow"
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
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}