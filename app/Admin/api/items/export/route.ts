import { isExportItemType, getExportItemTypeLabel, } from "@/lib/items/itemExportTypes"
import { createItemsExcelExport } from "@/lib/items/exportItemsToExcel"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url)
        const type = requestUrl.searchParams.get("type")
        console.log('hello')

        if (!isExportItemType(type)) {
            return Response.json(
                {
                    error: "A valid item type is required.",
                },
                {
                    status: 400,
                }
            )
        }

        const { buffer, fileName, itemCount, } = await createItemsExcelExport(type)

        if (itemCount === 0) {
            return Response.json(
                {
                    error: `There are no ${getExportItemTypeLabel(
                        type
                    ).toLowerCase()} to export.`,
                },
                {
                    status: 404,
                }
            )
        }

        return new Response(
            new Uint8Array(buffer),
            {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition":
                        `attachment; filename="${fileName}"`,
                    "Cache-Control":
                        "no-store, max-age=0",
                    "X-Item-Count":
                        String(itemCount),
                },
            }
        )
    } catch (error) {
        console.error(
            "Failed to export items:",
            error
        )

        return Response.json(
            {
                error:
                    "The spreadsheet could not be created.",
            },
            {
                status: 500,
            }
        )
    }
}