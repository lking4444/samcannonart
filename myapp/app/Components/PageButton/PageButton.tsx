import styles from './PageButton.module.css'

type PageButtonProps = {
    buttonName: string
}

export default function PageButton( {buttonName} : PageButtonProps) {

    return (
        <button className={styles.button}>
            {buttonName}
        </button>
    )
}