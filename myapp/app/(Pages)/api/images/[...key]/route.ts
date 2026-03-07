import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await context.params;
    const objectKey = key.join("/");

    const result = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: objectKey,
      })
    );

    if (!result.Body) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(result.Body as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": result.ContentType || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("S3 image error:", error);
    return new Response("Failed to load image", { status: 500 });
  }
}