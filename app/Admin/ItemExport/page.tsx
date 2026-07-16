"use client"
import { type FormEvent, useState, } from "react"

import { EXPORTABLE_ITEM_TYPES, type ExportItemType, } from "@/lib/items/itemExportTypes"

import styles from "./ItemExport.module.css"

type ExportErrorResponse = { error?: string }

function getDownloadFileName( contentDisposition: string | null, type: ExportItemType ): string {
    if (!contentDisposition) {
        return `${type.toLowerCase()}-items.xlsx`
    }

    const fileNameMatch =
        contentDisposition.match(
            /filename="([^"]+)"/i
        )

    return (
        fileNameMatch?.[1] ??
        `${type.toLowerCase()}-items.xlsx`
    )
}

export default function ItemExportPage() {
    const [selectedType, setSelectedType] = useState<ExportItemType>("CARD")
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleExport( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()

        if (isExporting) {
            return
        }

        setIsExporting(true)
        setError(null)

        try {
            const response = await fetch(
                `/Admin/api/items/export?type=${encodeURIComponent(
                    selectedType
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            )

            if (!response.ok) {
                const errorResponse =
                    (await response
                        .json()
                        .catch(
                            () => null
                        )) as ExportErrorResponse | null

                throw new Error(
                    errorResponse?.error ??
                        "The spreadsheet could not be exported."
                )
            }

            const spreadsheetBlob =
                await response.blob()

            const fileName =
                getDownloadFileName(
                    response.headers.get(
                        "Content-Disposition"
                    ),
                    selectedType
                )

            const downloadUrl =
                URL.createObjectURL(
                    spreadsheetBlob
                )

            const downloadLink =
                document.createElement("a")

            downloadLink.href = downloadUrl
            downloadLink.download = fileName
            downloadLink.style.display = "none"

            document.body.appendChild(
                downloadLink
            )

            downloadLink.click()
            downloadLink.remove()

            // Delaying this slightly is more reliable in Safari.
            window.setTimeout(() => {
                URL.revokeObjectURL(downloadUrl)
            }, 1000)
        } catch (error) {
            console.error(
                "Item export failed:",
                error
            )

            setError(
                error instanceof Error
                    ? error.message
                    : "The spreadsheet could not be exported."
            )
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section
                className={styles.exportContainer}
            >
                <div className={styles.heading}>

                    <h1 className={styles.title}>
                        Export items
                    </h1>

                    <p
                        className={
                            styles.description
                        }
                    >
                        Select an item type to
                        download all matching items
                        as an Excel spreadsheet.
                    </p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleExport}
                >
                    <div
                        className={
                            styles.fieldContainer
                        }
                    >
                        <label
                            className={styles.label}
                            htmlFor="export-item-type"
                        >
                            Item type
                        </label>

                        <select
                            id="export-item-type"
                            className={styles.select}
                            value={selectedType}
                            disabled={isExporting}
                            onChange={(event) =>
                                setSelectedType(
                                    event.target
                                        .value as ExportItemType
                                )
                            }
                        >
                            {EXPORTABLE_ITEM_TYPES.map(
                                (itemType) => (
                                    <option
                                        key={
                                            itemType.value
                                        }
                                        value={
                                            itemType.value
                                        }
                                    >
                                        {
                                            itemType.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={
                            styles.exportButton
                        }
                        disabled={isExporting}
                    >
                        {isExporting
                            ? "Creating spreadsheet..."
                            : "Export to Excel"}
                    </button>

                    {error && (
                        <p
                            className={
                                styles.error
                            }
                            role="alert"
                            aria-live="polite"
                        >
                            {error}
                        </p>
                    )}
                </form>
            </section>
        </main>
    )
}