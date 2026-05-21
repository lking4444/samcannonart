import { ItemClientWithTypes } from "@/app/Types/items";
import { Dispatch, SetStateAction } from "react";

async function save( setOriginalItem: Dispatch<SetStateAction<ItemClientWithTypes>>, setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>, setSelectedFile: Dispatch<SetStateAction<File | null>>, newItem: ItemClientWithTypes, selectedFile: File | null ) {
    if (selectedFile) {
        const expectedFileName = newItem.image?.split("/").pop() ?? newItem.image;
        const selectedFileName = selectedFile.name.replace(/\.jpg$/i, "");

        if (expectedFileName && selectedFileName !== expectedFileName) {
            throw new Error( `Image filename mismatch. Expected "${expectedFileName}", got "${selectedFileName}".` );
        }

        const imageId = expectedFileName.replace(/\.[^.]+$/, "");
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("itemType", newItem.type);
        formData.append("imageId", imageId);

        const uploadResponse = await fetch("/Admin/api/images/single", { method: "POST", body: formData, });

        if (!uploadResponse.ok) { throw new Error("Failed to upload image"); }
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

    if (!response.ok) { throw new Error("Failed to save item"); }

    const updatedItem = await response.json();

    setOriginalItem(updatedItem);
    setModifiedItem(updatedItem);
    setSelectedFile(null);
}

async function deleteItem(itemId: number) {
    const response = await fetch(`/Admin/api/items/delete/${itemId}`, { method: "DELETE", });
  
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to delete item");
    }
}

function reset( setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>, setSelectedFile: Dispatch<SetStateAction<File | null>>, originalItem: ItemClientWithTypes ) {
    setModifiedItem(originalItem);
    setSelectedFile(null);
}


export async function handleSave({
    setIsSaving,
    setSaveSuccess,
    setOriginalItem,
    setModifiedItem,
    setSelectedFile,
    modifiedItem,
    selectedFile,
}: {
    setIsSaving: Dispatch<SetStateAction<boolean>>;
    setSaveSuccess: Dispatch<SetStateAction<boolean>>;
    setOriginalItem: Dispatch<SetStateAction<ItemClientWithTypes>>;
    setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>;
    setSelectedFile: Dispatch<SetStateAction<File | null>>;
    modifiedItem: ItemClientWithTypes;
    selectedFile: File | null;
}) {
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
}
  
export function handleReset({
    setModifiedItem,
    setSelectedFile,
    originalItem,
}: {
    setModifiedItem: Dispatch<SetStateAction<ItemClientWithTypes>>;
    setSelectedFile: Dispatch<SetStateAction<File | null>>;
    originalItem: ItemClientWithTypes;
}) {
    reset(setModifiedItem, setSelectedFile, originalItem);
}
  
export async function handleDelete({
    originalItem,
    removeItem,
    setIsDeleting,
    setDeleteSuccess,
}: {
    originalItem: ItemClientWithTypes;
    removeItem: (id: number) => void;
    setIsDeleting: Dispatch<SetStateAction<boolean>>;
    setDeleteSuccess: Dispatch<SetStateAction<boolean>>;
}) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${originalItem.name}"?`
    );
  
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
}