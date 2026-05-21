import styles from '../pages.module.css'
import { ItemType} from '@/app/generated/prisma/client';
import ScrollableItemList from '../Components/ScrollableItemList';
import CalendarShowcase from '../Components/CalendarShowcase';

export default async function CalendarsPage(){
return  <div className={styles.pageHeader}>
          <h1 className={styles.cardTitle}>Calendars</h1>
          <ScrollableItemList type={ItemType.CALENDAR} pageSize={10} />
        </div>
}