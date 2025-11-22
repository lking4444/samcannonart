import Buy from "./Buy"

import styles from './ItemTile.module.css'

export default function ItemTile(){
    return (
        <span>
            <div className={styles.placeholderBox}></div>
            <Buy/>
            <Buy/>
        </span>
    )
}