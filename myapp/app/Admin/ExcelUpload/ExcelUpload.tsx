"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import styles from "./ExcelUpload.module.css";
import { UploadClientItem } from "@/lib/types";
import UploadItem from "../UploadItem";
import {
  filterItemsNotInDatabase,
  ParsedRow,
  mapRowToUploadItem,
  saveAllUploadItems,
  saveAllImages,
} from "@/lib/uploads";

type SelectedFilesMap = Record<number, File | null>;

export default function ExcelUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [items, setItems] = useState<UploadClientItem[]>([]);
  const [newItems, setNewItems] = useState<UploadClientItem[]>([]);
  const [originalNewItems, setOriginalNewItems] = useState<UploadClientItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFilesMap>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (updatedItem: UploadClientItem) => {
    setNewItems((current) =>
      current.map((item) =>
        item.uploadId === updatedItem.uploadId ? updatedItem : item
      )
    );
  };

  const handleFileChange = (uploadId: number, file: File | null) => {
    setSelectedFiles((current) => ({
      ...current,
      [uploadId]: file,
    }));
  };

  const handleResetItem = (uploadId: number) => {
    const originalItem = originalNewItems.find((item) => item.uploadId === uploadId);
    if (!originalItem) return;

    setNewItems((current) =>
      current.map((item) => (item.uploadId === uploadId ? originalItem : item))
    );

    setSelectedFiles((current) => ({
      ...current,
      [uploadId]: null,
    }));
  };

  const handleItemSaved = (uploadId: number) => {
    setNewItems((current) => current.filter((item) => item.uploadId !== uploadId));
    setOriginalNewItems((current) =>
      current.filter((item) => item.uploadId !== uploadId)
    );

    setSelectedFiles((current) => {
      const next = { ...current };
      delete next[uploadId];
      return next;
    });
  };

  const handleSaveAll = async () => {
    try {
      setError("");
      setIsSavingAll(true);
  
      await saveAllImages(newItems, selectedFiles);
      await saveAllUploadItems(newItems, setNewItems);
  
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to save all items"
      );
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleFile = async (file: File) => {
    setError("");
    setRows([]);
    setItems([]);
    setNewItems([]);
    setOriginalNewItems([]);
    setSelectedFiles({});
    setFileName("");

    const isExcel =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      setError("Please upload an Excel file (.xlsx or .xls).");
      return;
    }

    try {
      setFileName(file.name);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(firstSheet, {
        defval: "",
      });

      setRows(jsonData);

      const mappedItems = jsonData.map(mapRowToUploadItem);
      setItems(mappedItems);

      const response = await fetch("/Admin/api/admin/items/existing-upload-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadIds: mappedItems.map((item) => item.uploadId),
        }),
      });

      const data = await response.json();

      const filteredItems = filterItemsNotInDatabase(
        mappedItems,
        data.existingUploadIds
      );

      setNewItems(filteredItems);
      setOriginalNewItems(filteredItems);
    } catch (err) {
      console.error(err);
      setError("Failed to read the spreadsheet.");
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />

      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.icon}>📊</div>
        <h2 className={styles.title}>Upload Spreadsheet</h2>
        <p className={styles.text}>Drag and drop your Excel file here</p>
        <p className={styles.subtext}>or click to browse</p>
      </div>

      {fileName && (
        <div className={styles.fileCard}>
          <span className={styles.fileLabel}>Selected file</span>
          <span className={styles.fileName}>{fileName}</span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {newItems.length > 0 && (
        <>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.saveAllButton}
              onClick={handleSaveAll}
              disabled={isSavingAll}
            >
              {isSavingAll ? "Saving..." : `Save All (${newItems.length})`}
            </button>
          </div>

          <div className={styles.itemContainer}>
            {newItems.map((item) => (
              <UploadItem
                key={item.uploadId}
                item={item}
                selectedFile={selectedFiles[item.uploadId] ?? null}
                onItemChange={handleItemChange}
                onFileChange={handleFileChange}
                onReset={handleResetItem}
                onSaved={handleItemSaved}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}