import styles from './Home.module.css'

export default function HomePage(){

        return(
            <div className={styles.infoContainer}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.homeTitle}>
                        Sam Cannon <span className={styles.homeTitleBlue}>Art</span>
                    </h1>
                </div>
                <p className={styles.artistDescription}>I’m an artist living in Dorset, England. I work in watercolours, gouache, colour pencils and graphite pencil on board, paper, slates and stone.</p>
            </div>
            
        ) 
    }