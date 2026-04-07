// app/api/items/existing-upload-ids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getExistingUploadIds } from "@/lib/db/items";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const uploadIds = Array.isArray(body.uploadIds) ? body.uploadIds : [];

  const existingUploadIds = await getExistingUploadIds(uploadIds);

  return NextResponse.json({ existingUploadIds });
}