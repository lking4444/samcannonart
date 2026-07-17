import "server-only"

import { ItemType, Prisma } from "@prisma/client"
import * as XLSX from "xlsx"

import { prisma } from "@/lib/prisma"
import { type ExportItemType, getExportItemTypeLabel, } from "@/lib/items/itemExportTypes"

const itemExportInclude = {
    card: {
        select: {
            cardId: true,
        },
    },
    print: {
        select: {
            printId: true,
        },
    },
    notePad: {
        select: {
            notePadName: true,
        },
    },
    gift: {
        select: {
            giftNumber: true,
            giftType: true,
        },
    },
} satisfies Prisma.ItemInclude

type ItemForExport = Prisma.ItemGetPayload<{ include: typeof itemExportInclude }>

type ExportCell = string | number | boolean

type ExportRecord = Record<string, ExportCell>

const COMMON_HEADERS = [
    "Item ID",
    "Upload ID",
    "Hidden",
    "Name",
    "Type",
    "Price",
    "Image",
    "Stock",
    "Dimensions",
    "Media",
    "Description",
    "Year",
    "Popular",
    "Tags",
] as const

const TYPE_SPECIFIC_HEADERS: Record< ExportItemType, readonly string[] > = {
    CARD: ["Card ID"],
    CALENDAR: [],
    PRINT: ["Print ID"],
    ORIGINAL: [],
    NOTEPAD: ["Notepad Name"],
    GIFT: ["Gift Number", "Gift Type"],
}

function itemToExportRecord( item: ItemForExport, type: ExportItemType ): ExportRecord {
    const record: ExportRecord = {
        "Item ID": item.id,
        "Upload ID": item.uploadId ?? "",
        Hidden: item.hidden,
        Name: item.name,
        Type: item.type,
        "Price": Number(item.price.toString()),
        Image: item.image,
        Stock: item.stock,
        Dimensions: item.dimensions ?? "",
        Media: item.media ?? "",
        Description: item.description ?? "",
        Year: item.year ?? "",
        Popular: item.popular,
        Tags: item.tags.join(", "),
    }

    switch (type) {
        case "CARD":
            record["Card ID"] = item.card?.cardId ?? ""
            break

        case "PRINT":
            record["Print ID"] = item.print?.printId ?? ""
            break

        case "NOTEPAD":
            record["Notepad Name"] =
                item.notePad?.notePadName ?? ""
            break

        case "GIFT":
            record["Gift Number"] =
                item.gift?.giftNumber ?? ""

            record["Gift Type"] =
                item.gift?.giftType ?? ""
            break
        case "CALENDAR":
        case "ORIGINAL":
            break
    }

    return record
}

function calculateColumnWidths( headers: readonly string[], rows: ExportCell[][] ): XLSX.ColInfo[] {
    return headers.map((header, columnIndex) => {
        const contentLengths = rows.map((row) =>
            String(row[columnIndex] ?? "").length
        )

        const longestValue = Math.max(
            header.length,
            ...contentLengths
        )

        return {
            wch: Math.min(
                Math.max(longestValue + 2, 12),
                60
            ),
        }
    })
}

export async function createItemsExcelExport( type: ExportItemType ) {
    const items = await prisma.item.findMany({
        where: {
            type: type as ItemType,
        },
        include: itemExportInclude,
        orderBy: {
            id: "asc",
        },
    })

    const headers = [
        ...COMMON_HEADERS,
        ...TYPE_SPECIFIC_HEADERS[type],
    ]

    const records = items.map((item) =>
        itemToExportRecord(item, type)
    )

    const dataRows: ExportCell[][] = records.map((record) =>
        headers.map((header) => record[header] ?? "")
    )

    const worksheetRows: ExportCell[][] = [
        [...headers],
        ...dataRows,
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(
        worksheetRows
    )

    worksheet["!cols"] = calculateColumnWidths(
        headers,
        dataRows
    )

    if (headers.length > 0) {
        const finalCell = XLSX.utils.encode_cell({
            r: Math.max(worksheetRows.length - 1, 0),
            c: headers.length - 1,
        })

        worksheet["!autofilter"] = {
            ref: `A1:${finalCell}`,
        }
    }

    const priceColumnIndex =
        headers.indexOf("Price (GBP)")

    if (priceColumnIndex !== -1) {
        for (
            let rowIndex = 1;
            rowIndex < worksheetRows.length;
            rowIndex += 1
        ) {
            const cellAddress =
                XLSX.utils.encode_cell({
                    r: rowIndex,
                    c: priceColumnIndex,
                })

            const cell = worksheet[cellAddress]

            if (cell) {
                cell.z = "£0.00"
            }
        }
    }

    const workbook = XLSX.utils.book_new()

    const itemTypeLabel =
        getExportItemTypeLabel(type)

    workbook.Props = {
        Title: `${itemTypeLabel} Export`,
        Subject: `${itemTypeLabel} inventory`,
        Author: "Sam Cannon Art",
        CreatedDate: new Date(),
    }

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${itemTypeLabel} Items`.slice(0, 31)
    )

    const buffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
        compression: true,
    })

    const date = new Date()
        .toISOString()
        .slice(0, 10)

    return {
        buffer,
        itemCount: items.length,
        fileName: `${type.toLowerCase()}-items-${date}.xlsx`,
    }
}