
import ItemTile from "../../Components/ItemTile";

import styles from './ItemList.module.css'
import { ItemElement } from "../../Types";



export default function ItemList(){

    const item: ItemElement = {
        id: 1,
        name: "Test",
        type: "Card", 
        price: 10,
        imageSrc: "/Images/Art/image1.png"
    };


    return (
            <div className={styles.tileContainer}>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>
                <ItemTile item={item}/>

            </div>
    )
}
