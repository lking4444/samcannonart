import sharp from "sharp";

export const IMAGE_UPLOAD_CONFIG = {
    thumbnailWidth: 600,
    webpQuality: 70,
} as const;

export type ProcessedImage = {
    buffer: Buffer;
    contentType: "image/webp";
    extension: "webp";
    width?: number;
    height?: number;
};

export type FileImageInput = {
  file: File;
  key: string;
};

export type ProcessedUploadImage = {
  key: string;
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
  width?: number;
  height?: number;
};

export async function processImageToWebp( input: Buffer, options?: { width?: number; quality?: number; } ): Promise<ProcessedImage> {
    const width = options?.width ?? IMAGE_UPLOAD_CONFIG.thumbnailWidth;
    const quality = options?.quality ?? IMAGE_UPLOAD_CONFIG.webpQuality;

    const image = sharp(input, {
        failOn: "error",
    }).rotate(); 

    const metadata = await image.metadata();

    const shouldResize =
        typeof metadata.width === "number" && metadata.width > width;

    const pipeline = shouldResize
        ? image.resize({
            width,
            withoutEnlargement: true,
        })
        : image;

    const outputBuffer = await pipeline
        .webp({
            quality,
            effort: 6,
        })
        .toBuffer();

    const outputMetadata = await sharp(outputBuffer).metadata();

    return {
        buffer: outputBuffer,
        contentType: "image/webp",
        extension: "webp",
        width: outputMetadata.width,
        height: outputMetadata.height,
    };
}

export async function fileToWebpBuffer( file: File, options?: { width?: number; quality?: number; } ): Promise<ProcessedImage> {
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    return processImageToWebp(inputBuffer, options);
}

export async function processFilesToWebp( images: FileImageInput[], options?: { width?: number; quality?: number; } ): Promise<ProcessedUploadImage[]> {
    return Promise.all(
        images.map(async ({ file, key }) => {
        const processed = await fileToWebpBuffer(file, options);

        return {
            key: key.replace(/\.[^.]+$/, "") + ".webp",
            buffer: processed.buffer,
            contentType: processed.contentType,
            extension: processed.extension,
            width: processed.width,
            height: processed.height,
        };
        })
    );
}