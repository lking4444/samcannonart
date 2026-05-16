import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ItemType } from "@/app/generated/prisma/client";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    

}