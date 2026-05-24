import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getImageKey } from "@/lib/images/imagepaths";
import { UploadMetadataWithId } from "@/app/Admin/Types/upload";
import { isItemType } from "@/lib/uploads/uploads";

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

    const files = formData.getAll("files");
    const metadataEntries = formData.getAll("metadata");

    if (files.length === 0) {
      return new Response("No files uploaded", { status: 400 });
    }

    if (files.length !== metadataEntries.length) {
      return new Response("Files and metadata count mismatch", { status: 400 });
    }

    const uploads: { uploadId: number; key: string; url: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadataEntry = metadataEntries[i];

      if (!(file instanceof File)) {
        return new Response(`Invalid file at index ${i}`, { status: 400 });
      }

      if (typeof metadataEntry !== "string") {
        return new Response(`Invalid metadata at index ${i}`, { status: 400 });
      }

      let metadata: UploadMetadataWithId;
      
      try {
        metadata = JSON.parse(metadataEntry);
      } catch {
        return new Response(`Invalid metadata JSON at index ${i}`, {
          status: 400,
        });
      }

      const { uploadId, itemType, imageId, filename } = metadata;

      if (!isItemType(itemType)) {
        return new Response(`Invalid itemType for uploadId ${uploadId}`, {
          status: 400,
        });
      }

      if (typeof imageId !== "string" || !imageId.trim()) {
        return new Response(`Invalid imageId for uploadId ${uploadId}`, {
          status: 400,
        });
      }

      if (!file.type.startsWith("image/")) {
        return new Response(`Only image files are allowed for uploadId ${uploadId}`, {
          status: 400,
        });
      }

      if (file.name !== filename) {
        return new Response(`Filename mismatch for uploadId ${uploadId}`, {
          status: 400,
        });
      }

      const key = getImageKey(itemType, imageId.trim());
      const buffer = Buffer.from(await file.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
        })
      );

      uploads.push({
        uploadId,
        key,
        url: `/api/images/${key}`,
      });
    }

    return Response.json({
      message: "Bulk upload successful",
      uploads,
    });
  } catch (error) {
    console.error("Bulk S3 upload error:", error);
    return new Response("Failed to upload images", { status: 500 });
  }
}