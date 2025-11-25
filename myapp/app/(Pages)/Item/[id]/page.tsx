import ItemDetails from "../../Components/ItemDetails";

export default async function Item({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  
    return (
            <ItemDetails></ItemDetails>
    );
  }