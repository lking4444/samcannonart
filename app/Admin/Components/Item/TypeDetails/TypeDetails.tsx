import { ItemClientWithTypes, ItemType } from "@/app/Types/items";

type Props = {
  item: ItemClientWithTypes;
};

export default function TypeDetails({ item }: Props) {
  switch (item.type) {
        case ItemType.CARD:
            return item.card ? <p>Card ID: {item.card.cardId}</p> : null;

        case ItemType.PRINT:
            return item.print ? <p>Print ID: {item.print.printId}</p> : null;

        case ItemType.NOTEPAD:
            return item.notePad ? <p>NotePad Name: {item.notePad.notePadName}</p> : null;

        case ItemType.GIFT:
            return item.gift ? (
                <>
                    <p>Gift Number: {item.gift.giftNumber}</p>
                    {item.gift.giftType && <p>Gift Type: {item.gift.giftType}</p>}
                </>
            ) : null;

        case ItemType.CALENDAR:
            return <p>Calendar item</p>;

        case ItemType.ORIGINAL:
            return <p>Original item</p>;

        case ItemType.SLATE:
            return <p>Slate item</p>;

        default:
            return null;
    }
}