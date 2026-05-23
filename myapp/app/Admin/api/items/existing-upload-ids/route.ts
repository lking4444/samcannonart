import { NextRequest, NextResponse } from "next/server";

import { getExistingUploadIds } from "@/lib/db/items";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const body = await req.json();
  const uploadIds = Array.isArray(body.uploadIds) ? body.uploadIds : [];

  const existingUploadIds = await getExistingUploadIds(uploadIds);

  return NextResponse.json({ existingUploadIds });
}