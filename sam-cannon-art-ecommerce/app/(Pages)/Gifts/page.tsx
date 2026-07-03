import styles from '../pages.module.css'
import { ItemType} from '@prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';


export default async function GiftsPage(){
    return <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Gifts</h1>
              <ScrollableItemList type={ItemType.GIFT} pageSize={10} />
            </div>
}