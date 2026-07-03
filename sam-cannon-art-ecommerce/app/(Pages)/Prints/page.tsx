import styles from '../pages.module.css'
import { ItemType} from '@prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';

export default async function PrintsPage(){
    return <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Prints</h1>
              <ScrollableItemList type={ItemType.PRINT} pageSize={10} />
            </div>
}