import KeyWordSearch from "../Components/KeyWordSearch";
import MultiSelect from "../Components/MultiSelect";

import styles from './Cards.module.css'

export default function CardsPage(){
    return <div className={styles.pageHeader}>
            <h1 className={styles.cardTitle}>Cards</h1>
            <span className={styles.searchFilters}>
                <KeyWordSearch></KeyWordSearch>
                <MultiSelect multiSelectCategory="Card Sizes" multiSelectOptions={["32x32", "16x16", "All"]}></MultiSelect>
                <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={["High to Low", "Low to High", "Default"]}></MultiSelect>
                <MultiSelect multiSelectCategory="Card Themes" multiSelectOptions={["Love", "Friendship", "Happiness"]}></MultiSelect>
            </span>
           
         </div>
}