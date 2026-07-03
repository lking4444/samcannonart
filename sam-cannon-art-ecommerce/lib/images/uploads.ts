import { SelectedFilesMap, SelectedImage, UploadClientItem, UploadImageInput, UploadImagesResponse } from "@/app/Types/upload";

export function getImageIdFromFileName(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, "");
}

export async function saveAllImages( items: UploadClientItem[], selectedFiles: SelectedFilesMap ) {
    if (items.length === 0) return;

    const formData = new FormData();
    let fileCount = 0;

    for (const item of items) {
        const file = selectedFiles[item.uploadId];

        // Image is optional, skip if no file was selected
        if (!file) {
            continue;
        }

        if (file.name.replace(/\.[^.]+$/, "") !== item.image) {
            throw new Error(
                `Image filename mismatch for uploadId ${item.uploadId}. Expected "${item.image}", got "${file.name}".`
            );
        }

        const imageId = item.image.replace(/\.[^.]+$/, "");

        formData.append("files", file);
        formData.append(
            "metadata",
            JSON.stringify({
                uploadId: item.uploadId,
                itemType: item.type,
                imageId,
                filename: file.name,
            })
        );

        fileCount++;
    }

    // no images selected
    if (fileCount === 0) {
        return;
    }

    const response = await fetch("/Admin/api/images/bulk-with-id", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to upload all images");
    }

    return response.json();
}

export async function bulkImageUpload( images: UploadImageInput[] ): Promise<UploadImagesResponse> {
    if (images.length === 0) {
      throw new Error("No images provided");
    }
  
    const formData = new FormData();
  
    for (const image of images) {
        formData.append("files", image.file);
    
        formData.append(
            "metadata",
            JSON.stringify({
            itemType: image.itemType,
            imageId: image.imageId,
            filename: image.file.name,
            })
        );
    }
  
    const response = await fetch("/Admin/api/images/bulk", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload images");
    }
  
    return response.json();
}

export function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}
  
export function createSelectedImage(file: File): SelectedImage {
    return {
        file,
        previewUrl: URL.createObjectURL(file),
        imageId: getImageIdFromFileName(file.name),
    };
}