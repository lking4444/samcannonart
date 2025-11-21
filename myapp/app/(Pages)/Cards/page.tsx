import MultiSelect from "../Components/MultiSelect";

export default function CardsPage(){
    return <div>
            <MultiSelect multiSelectCategory="Card Sizes" multiSelectOptions={["32x32", "16x16", "All"]}></MultiSelect>
            <MultiSelect multiSelectCategory="Sort by Price" multiSelectOptions={["High to Low", "Low to High", "Default"]}></MultiSelect>
            <MultiSelect multiSelectCategory="Card Themes" multiSelectOptions={["Love", "Friendship", "Happiness"]}></MultiSelect>
         </div>
}