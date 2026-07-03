import { GIFT_TYPE, ITEM_TYPE, ItemType } from "./items";

export type UploadClientItem = {
    name: string;
    uploadId: string;
    type: ITEM_TYPE;
    price: string;
    image: string;
    stock: number;
    tags: string[];
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
    cardId?: string | undefined;
    printId?: string | undefined;
    notePadName?: string | undefined;
    giftNumber?: number | undefined;
    giftType?: GIFT_TYPE | undefined;
};

export type UploadImageInput = {
    file: File;
    itemType: ITEM_TYPE;
    imageId: string;
};

export type SelectedImage = {
    file: File;
    previewUrl: string;
    imageId: string;
};
  
export type UploadImageResult = {
    key: string;
    url: string;
  };
  
export type UploadImagesResponse = {
    message: string;
    uploads: UploadImageResult[];
};

export type ItemTypeValue = (typeof ItemType)[keyof typeof ItemType];

export type ParsedRow = Record<string, unknown>;

export type SelectedFilesMap = Record<string, File | null>;