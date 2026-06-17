export const runtime = "nodejs";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getThumbnailKey } from "@/lib/images/imagepaths";
import { isItemType } from "@/lib/uploads/uploads";
import { fileToWebpBuffer } from "@/lib/images/imageProcessing";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

    const key = getThumbnailKey(itemTypeValue, imageIdValue.trim());

    const processedImage = await fileToWebpBuffer(file);

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: processedImage.buffer,
        ContentType: processedImage.contentType,
        CacheControl: "public, max-age=31536000, immutable",
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