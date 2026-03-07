import styles from '../pages.module.css'
import { ItemType} from '@/app/generated/prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';

export default async function SlatesPage(){
    return <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Slates</h1>
              <ScrollableItemList type={ItemType.CALENDAR} pageSize={10} />    
            </div>
}