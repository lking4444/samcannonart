// components/ItemTypeDetails.tsx
import { ItemType, UploadClientItem } from "@/lib/types";

type Props = {
  item: UploadClientItem;
};

export default function TypeDetails({ item }: Props) {
    console.log(`${item.cardId}`)


    switch (item.type) {
            case ItemType.CARD:
                return item.cardId ? <p>Card ID: {item.cardId}</p> : null;

            case ItemType.PRINT:
                return item.printId ? <p>Print ID: {item.printId}</p> : null;

            case ItemType.NOTEPAD:
                return item.notePadName ? <p>NotePad Name: {item.notePadName}</p> : null;

            case ItemType.GIFT:
                return item.giftNumber ? (
                    <>
                    <p>Gift Number: {item.giftNumber}</p>
                    {item.giftType && <p>Gift Type: {item.giftType}</p>}
                    </>
                ) : null;

            default:
                return null;
        }
}