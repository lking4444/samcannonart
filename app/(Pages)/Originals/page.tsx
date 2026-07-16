import styles from '../Cards/Cards.module.css'
import { ItemType} from '@prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';

export default async function OriginalsPage(){
    return  <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Originals</h1>
              <ScrollableItemList type={ItemType.ORIGINAL} pageSize={10} />
            </div>
}