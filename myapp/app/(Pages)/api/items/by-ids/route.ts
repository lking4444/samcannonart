import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { ids } = (await req.json()) as { ids: number[] }

  const items = await prisma.item.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, image: true, price: true, type: true },
  })

  return NextResponse.json(items)
}