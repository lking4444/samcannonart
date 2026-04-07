import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ItemType } from "@/app/generated/prisma/enums";
import { getImageKey } from "@/lib/imagepaths";


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function isItemType(value: string): value is ItemType {
  return Object.values(ItemType).includes(value as ItemType);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const itemTypeValue = formData.get("itemType");
    const imageIdValue = formData.get("imageId");

    if (!(file instanceof File)) {
      return new Response("No file uploaded", { status: 400 });
    }

    if (typeof itemTypeValue !== "string" || !isItemType(itemTypeValue)) {
      return new Response("Invalid or missing itemType", { status: 400 });
    }

    if (typeof imageIdValue !== "string" || !imageIdValue.trim()) {
      return new Response("Invalid or missing imageId", { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return new Response("Only image files are allowed", { status: 400 });
    }

    const key = getImageKey(itemTypeValue, imageIdValue.trim());
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return Response.json({
      message: "Upload successful",
      key,
      url: `/api/images/${key}`,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return new Response("Failed to upload image", { status: 500 });
  }
}