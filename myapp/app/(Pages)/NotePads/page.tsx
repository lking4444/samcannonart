import styles from '../pages.module.css'
import { ItemType} from '@/app/generated/prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';

export default async function NotepadsPage(){

    return <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Notepads</h1>
              <ScrollableItemList type={ItemType.NOTEPAD} pageSize={10} />
            </div>
}