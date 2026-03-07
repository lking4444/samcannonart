import styles from './Cards.module.css'
import { ItemType} from '@/app/generated/prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';


export default async function CardsPage(){
    return  <div className={styles.pageHeader}>
              <h1 className={styles.cardTitle}>Cards</h1>
              <ScrollableItemList type={ItemType.CARD} pageSize={10} />
            </div>
}